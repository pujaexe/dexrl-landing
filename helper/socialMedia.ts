export const getShareCaption = (tokenSymbol: string, saved: string, shareUrl: string) => {
    const caption = `Just completed a ${tokenSymbol} swap on OXO 🚀
Executed directly from my wallet with an optimized route (~${saved}% vs avg. market price).

Try on-chain swaps 👉 ${shareUrl}`;

    return caption;
};

export type SocialMediaPlatform = "twitter" | "facebook" | "telegram" | "whatsapp" | "linkedin";
export const socialMediaLinks = (username: string, platform: SocialMediaPlatform) => {
    switch (platform) {
        case "twitter":
            return {
                name: "Twitter / X",
                icon: "codicon:twitter",
                getUrl: (text: string) => {
                    const encodedText = encodeURIComponent(text);
                    return `https://twitter.com/intent/tweet?text=${encodedText}`;
                },
            }
        case "telegram":
            return {
                name: "Telegram",
                icon: "mingcute:telegram-fill",
                getUrl: (text: string) => {
                    const shareUrl = `https://oxo.so/${username}`;
                    return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
                },
            }
        case "whatsapp":
            return {
                name: "WhatsApp",
                icon: "mingcute:whatsapp-line",
                getUrl: (text: string) => {
                    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
                },
            }
        default:
            return null;
    }
};

export const socialMediaPlatforms: SocialMediaPlatform[] = [
    "twitter",
    "telegram",
    "whatsapp",
];