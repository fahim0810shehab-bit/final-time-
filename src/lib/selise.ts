

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const X_BLOCKS_KEY = import.meta.env.VITE_X_BLOCKS_KEY;

export class SeliseIAM {
  static async register(username: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/idp/v1/Authentication/Register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blocks-key': X_BLOCKS_KEY,
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error_description || 'Registration failed');
    }
    return res.json();
  }

  static async login(email: string, password: string) {
    const body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('username', email);
    body.append('password', password);

    const res = await fetch(`${API_BASE}/idp/v1/Authentication/Token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-blocks-key': X_BLOCKS_KEY,
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error_description || 'Login failed. Check your credentials.');
    }
    const data = await res.json();
    return {
      id: data.sub,
      email: data.email || email,
      username: data.username || email.split('@')[0],
      name: (data.firstName + ' ' + data.lastName).trim() || data.username || email.split('@')[0],
      token: data.access_token
    };
  }

  static getGoogleLoginUrl() {
    const redirectUri = import.meta.env.VITE_BLOCKS_OIDC_REDIRECT_URI;
    return `${API_BASE}/idp/v1/Authentication/ExternalLogin?provider=Google&X-Blocks-Key=${X_BLOCKS_KEY}&redirectUri=${encodeURIComponent(redirectUri)}`;
  }

  static async exchangeCode(code: string) {
    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('client_id', import.meta.env.VITE_BLOCKS_OIDC_CLIENT_ID);
    body.append('redirect_uri', import.meta.env.VITE_BLOCKS_OIDC_REDIRECT_URI);
    body.append('code', code);

    const res = await fetch(`${API_BASE}/idp/v1/Authentication/Token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-blocks-key': X_BLOCKS_KEY,
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error_description || 'Code exchange failed');
    }
    const data = await res.json();
    return {
      id: data.sub,
      email: data.email || '',
      username: data.username || data.email?.split('@')[0] || 'user',
      name: (data.firstName + ' ' + data.lastName).trim() || data.username || data.email?.split('@')[0] || 'User',
      token: data.access_token
    };
  }
}

export class SeliseDataGateway {
  static async query(token: string, queryStr: string, variables: any) {
    const slug = import.meta.env.VITE_PROJECT_SLUG;
    const res = await fetch(`${API_BASE}/dgs/v1/${slug}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blocks-key': X_BLOCKS_KEY,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query: queryStr, variables })
    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  }
}

export class SeliseMedia {
  static async upload(token: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE}/mds/v1/Media`, {
        method: 'POST',
        headers: {
          'x-blocks-key': X_BLOCKS_KEY,
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.url || data.fileUrl || data.data?.url || '';
    } catch (err) {
      return URL.createObjectURL(file); // Fallback
    }
  }
}
