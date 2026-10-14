import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { fromNodeHeaders } from 'better-auth/node';
import { pool, memStore } from './db.js';
import { allowedOrigins } from './runtime-config.js';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.BETTER_AUTH_SECRET || 'palateo_development_secret_min_32_characters_random_key';
const baseURL = process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 3000}`;

export const auth = betterAuth({
  database: pool || undefined,
  secret,
  baseURL,
  basePath: '/api/auth',
  plugins: [
    bearer()
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  user: {
    deleteUser: {enabled:true, afterDelete:async user=>{
      if(pool)return;
      memStore.profiles.delete(user.id);memStore.tasteProfiles.delete(user.id);
      for(const key of memStore.savedRestaurants.keys())if(key.startsWith(user.id+':'))memStore.savedRestaurants.delete(key);
      memStore.interactions=memStore.interactions.filter(row=>row.user_id!==user.id);
      memStore.events=memStore.events.filter(row=>row.user_id!==user.id);
      for(const [key,row] of memStore.connections)if(row.requester_id===user.id||row.recipient_id===user.id)memStore.connections.delete(key);
      memStore.waitlist.delete(user.email);
    }},
    additionalFields: {
      palateo_legal_version:{type:'string',required:false,input:true},
      palateo_legal_accepted_at:{type:'string',required:false,input:true},
      palateo_privacy_consent:{type:'boolean',required:false,input:true,defaultValue:false},
      phone: {
        type: 'string',
        required: false,
        input: true
      },
      onboarding_completed: {
        type: 'boolean',
        defaultValue: false,
        input: true
      },
      display_name: {
        type: 'string',
        required: false,
        input: true
      },
      bio: {
        type: 'string',
        required: false,
        input: true
      }
    }
  },
  trustedOrigins: allowedOrigins
});

/**
 * Helper to extract current user session from an incoming HTTP request
 * Works with both Cookie (better-auth.session_token) and Authorization: Bearer <token>
 */
export async function getAuthUser(req) {
  try {
    let headers;
    if (req.headers instanceof Headers) {
      headers = req.headers;
    } else {
      headers = new Headers();
      if (req.headers) {
        for (const [k, v] of Object.entries(req.headers)) {
          if (v) headers.set(k.toLowerCase(), Array.isArray(v) ? v.join(', ') : String(v));
        }
      }
    }
    const session = await auth.api.getSession({
      headers
    });
    return session?.user || null;
  } catch (err) {
    console.warn('[Better Auth] Session verification error:', err.message);
    return null;
  }
}
