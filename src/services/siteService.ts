import { SiteData } from '../types';
import { SeliseDataGateway } from '../lib/selise';
import { createDefaultDocument } from '../utils/vibeDefaults';

export const siteService = {
  async getSite(token: string, userId: string): Promise<SiteData> {
    const query = `
      query GetUserSite($userId: String!) {
        UserSite(where: { UserId: { _eq: $userId } }) {
          UserId
          Username
          IsPublished
          RootNode
        }
      }
    `;
    const data = await SeliseDataGateway.query(token, query, { userId });
    const site = data.UserSite?.[0];

    if (!site) {
      return { user_id: userId, username: '', is_published: false, document: createDefaultDocument() };
    }

    let doc = createDefaultDocument();
    try {
      if (site.RootNode) doc = JSON.parse(site.RootNode);
    } catch(e) {}

    return {
      user_id: site.UserId,
      username: site.Username,
      is_published: site.IsPublished,
      document: doc
    };
  },

  async getSiteByUsername(username: string): Promise<SiteData | null> {
    // No auth token needed for public fetch according to prompt (though API might require it. We'll use a blank token or try without).
    // The prompt says "no auth token needed" for getSiteByUsername.
    const query = `
      query GetByUsername($username: String!) {
        UserSite(where: { Username: { _eq: $username } }) {
          UserId
          Username
          IsPublished
          RootNode
        }
      }
    `;
    // We might have to construct a raw fetch if the wrapper requires token
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dgs/v1/${import.meta.env.VITE_PROJECT_SLUG}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-blocks-key': import.meta.env.VITE_X_BLOCKS_KEY
      },
      body: JSON.stringify({ query, variables: { username } })
    });
    const json = await res.json();
    const site = json.data?.UserSite?.[0];
    if (!site) return null;

    let doc = createDefaultDocument();
    try {
      if (site.RootNode) doc = JSON.parse(site.RootNode);
    } catch(e) {}

    return {
      user_id: site.UserId,
      username: site.Username,
      is_published: site.IsPublished,
      document: doc
    };
  },

  async saveSite(token: string, siteData: SiteData) {
    // Optimistic fallback
    localStorage.setItem(`site_${siteData.user_id}`, JSON.stringify(siteData));

    const mutation = `
      mutation UpsertUserSite($object: UserSite_insert_input!) {
        insert_UserSite_one(
          object: $object
          on_conflict: {
            constraint: UserSite_UserId_key
            update_columns: [IsPublished, RootNode, Username]
          }
        ) { UserId Username IsPublished }
      }
    `;
    
    const variables = {
      object: {
        UserId: siteData.user_id,
        Username: siteData.username,
        IsPublished: siteData.is_published,
        RootNode: JSON.stringify(siteData.document)
      }
    };

    await SeliseDataGateway.query(token, mutation, variables);
  }
};
