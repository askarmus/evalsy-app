'use client';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react';
import { Linkedin, Facebook, Twitter, MessageCircle, Send, Mail, Copy, Share, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function SocialShareDropdown({ url = typeof window !== 'undefined' ? window.location.href : 'https://evalsy.com', title = 'Check this out!' }: { url?: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const enc = (v: string) => encodeURIComponent(v);

  const links = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    whatsapp: `https://wa.me/?text=${enc(title)}%20${enc(url)}`,
    telegram: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
    email: `mailto:?subject=${enc(title)}&body=${enc(url)}`,
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button size="sm" radius="full" variant="flat" color="secondary" startContent={<ShareIcon />}>
          Share Job
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Share Actions">
        <DropdownItem key="linkedin" startContent={<Linkedin size={16} />} href={links.linkedin} target="_blank">
          LinkedIn
        </DropdownItem>
        <DropdownItem key="facebook" startContent={<Facebook size={16} />} href={links.facebook} target="_blank">
          Facebook
        </DropdownItem>
        <DropdownItem key="twitter" startContent={<Twitter size={16} />} href={links.twitter} target="_blank">
          X (Twitter)
        </DropdownItem>
        <DropdownItem key="whatsapp" startContent={<MessageCircle size={16} />} href={links.whatsapp} target="_blank">
          WhatsApp
        </DropdownItem>
        <DropdownItem key="telegram" startContent={<Send size={16} />} href={links.telegram} target="_blank">
          Telegram
        </DropdownItem>
        <DropdownItem key="email" startContent={<Mail size={16} />} href={links.email}>
          Email
        </DropdownItem>
        <DropdownItem key="copy" startContent={<Copy size={16} />} onClick={copyToClipboard}>
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

function ShareIcon() {
  return <Share2 />;
}
