import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { siteService } from '../services/siteService';
import { useAuthStore } from '../store/authStore';

export const useAutoSave = () => {
  const { pages, setSaveStatus, siteDataRef } = useEditorStore();
  const { user } = useAuthStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const userRef = useRef(user);
  const siteDataRefLocal = useRef(siteDataRef);

  useEffect(() => { userRef.current = user; }, [user]);
  useEffect(() => { siteDataRefLocal.current = siteDataRef; }, [siteDataRef]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!userRef.current || !siteDataRefLocal.current) return;

    setSaveStatus('unsaved');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const payload = {
          ...siteDataRefLocal.current!,
          document: {
            ...siteDataRefLocal.current!.document,
            pages
          }
        };
        await siteService.saveSite(userRef.current!.token, payload);
        setSaveStatus('saved');
      } catch (err) {
        console.error('Save error', err);
        setSaveStatus('error');
      }
    }, 1500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pages]); // Trigger on pages change
};
