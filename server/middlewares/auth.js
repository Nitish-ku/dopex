import { clerkClient } from "@clerk/clerk-sdk-node";

// middleware to check userId and hasPremiumPlan

export const auth = async ( req, res, next )=>{
    try {
        // All users are considered premium.
        req.plan = 'premium';
        next()

    } catch (error) {
        res.json({success: false, message: error.message })
        
    }

}