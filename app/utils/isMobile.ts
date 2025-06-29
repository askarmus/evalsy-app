// utils/isMobile.ts
export const isMobile = () => typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(window.navigator.userAgent);
