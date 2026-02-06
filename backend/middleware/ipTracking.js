const axios = require('axios');
const logger = require('../utils/logger');

// Cache for IP locations to prevent excessive API calls
const locationCache = new Map();
const lastRequestTime = new Map();
const REQUEST_COOLDOWN = 5000; // 5 seconds between requests for same IP

// Function to get external public IP (for localhost development)
const getExternalIP = async () => {
    try {
        const services = [
            'https://api.ipify.org?format=json',
            'https://ipinfo.io/json',
            'https://httpbin.org/ip'
        ];

        for (const service of services) {
            try {
                const response = await axios.get(service, { timeout: 3000 });
                if (service.includes('ipify')) {
                    return response.data.ip;
                } else if (service.includes('ipinfo')) {
                    return response.data.ip;
                } else if (service.includes('httpbin')) {
                    return response.data.origin;
                }
            } catch (err) {
                continue; // Try next service
            }
        }
        return null;
    } catch (error) {
        logger.warn('Failed to get external IP:', error.message);
        return null;
    }
};

// Function to get real client IP
const getRealIP = async (req) => {
    // Check for various headers that might contain the real IP
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];
    const clientIP = req.headers['x-client-ip'];

    if (forwarded) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    if (clientIP) {
        return clientIP;
    }

    // Fall back to req.ip (Express's IP detection)
    const ip = req.ip || req.connection?.remoteAddress;
    if (ip) {
        // Handle IPv6 localhost (::1) and IPv4-mapped IPv6 addresses
        if (ip === '::1' || ip === '::ffff:127.0.0.1') {
            // For localhost: Get actual public IP instead
            const externalIP = await getExternalIP();
            if (externalIP) {
                logger.info(`🌍 Using external public IP: ${externalIP} instead of localhost`);
                return externalIP;
            }
            return '127.0.0.1';
        }
        // Remove IPv6 prefix for IPv4 addresses
        if (ip.startsWith('::ffff:')) {
            return ip.substring(7);
        }
        return ip;
    }

    // Last resort: try to get external IP
    const externalIP = await getExternalIP();
    if (externalIP) {
        logger.info(`🌍 Fallback to external public IP: ${externalIP}`);
        return externalIP;
    }

    return '127.0.0.1';
};

// Function to get location from IP using a free service with caching and rate limiting
const getLocationFromIP = async (ip) => {
    // Only skip geolocation for private network IPs
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return 'Private Network';
    }

    // Handle localhost cases
    if (ip === '127.0.0.1' || ip === 'localhost' || ip === '::1') {
        logger.warn('Still got localhost IP, attempting to get location anyway');
        return 'Local Network';
    }

    // Check cache first
    if (locationCache.has(ip)) {
        const cachedData = locationCache.get(ip);
        // Cache expires after 24 hours
        if (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) {
            return cachedData.location;
        }
    }

    // Check rate limiting
    const now = Date.now();
    const lastRequest = lastRequestTime.get(ip);
    if (lastRequest && (now - lastRequest) < REQUEST_COOLDOWN) {
        // Return cached value or default if too recent
        const cached = locationCache.get(ip);
        return cached ? cached.location : 'Unknown';
    }

    // Update last request time
    lastRequestTime.set(ip, now);

    try {
        // Using ipapi.co free tier (1000 requests per day)
        const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
            timeout: 5000 // 5 second timeout
        });

        if (response.data && response.data.city) {
            // Return city, region, country format
            const location = [
                response.data.city,
                response.data.region,
                response.data.country_name
            ].filter(Boolean).join(', ');

            // Cache the result
            locationCache.set(ip, { location, timestamp: now });
            return location || 'Unknown';
        }

        // Cache unknown result to prevent repeat requests
        locationCache.set(ip, { location: 'Unknown', timestamp: now });
        return 'Unknown';
    } catch (error) {
        logger.warn(`IP geolocation error for ${ip}:`, error.message);

        // Cache unknown result to prevent repeat requests
        locationCache.set(ip, { location: 'Unknown', timestamp: now });
        return 'Unknown';
    }
};

// Middleware to track IP and location
const trackIPAndLocation = async (req, res, next) => {
    try {
        // Get the real IP (now async to fetch external IP)
        let realIP = await getRealIP(req);
        req.realIP = realIP;

        // Log the real IP for debugging
        logger.debug(`🔍 IP detected: ${realIP}`);

        // Get location synchronously for critical routes or asynchronously for others
        const isCriticalRoute = req.url.includes('/api/claims') ||
            req.url.includes('/api/drafts');

        if (isCriticalRoute) {
            // For form submissions, get location synchronously to ensure it's available
            try {
                const locationResult = await getLocationFromIP(realIP);
                req.ipLocation = locationResult;
                logger.debug('Location resolved for', realIP, ':', req.ipLocation);
            } catch (error) {
                logger.error('Error getting location for critical route:', error.message);
                req.ipLocation = realIP === '127.0.0.1' ? 'Local' : 'Unknown';
            }
        } else {
            // For other routes, get location asynchronously (don't block the request)
            getLocationFromIP(realIP).then(location => {
                req.ipLocation = location;
            }).catch(err => {
                if (err.response?.status !== 429) {
                    logger.error('Error in IP location tracking:', err.message);
                }
                req.ipLocation = 'Unknown';
            });

            // Set a default location immediately
            req.ipLocation = realIP === '127.0.0.1' ? 'Local' : 'Resolving...';
        }

        next();
    } catch (error) {
        logger.error('Error in IP tracking middleware:', error);
        req.realIP = '127.0.0.1';
        req.ipLocation = 'Unknown';
        next();
    }
};

module.exports = {
    getRealIP,
    getLocationFromIP,
    trackIPAndLocation
};
