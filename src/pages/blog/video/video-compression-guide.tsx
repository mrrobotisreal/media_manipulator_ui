import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import mixpanel from 'mixpanel-browser';

const VideoCompressionGuide: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Video Compression Guide',
      page_path: '/blog/video/video-compression-guide',
      user_tier: 'free'
    });
  }, []);

  return (
    <Card className="max-w-4xl mx-auto my-2">
      <div className="p-6 pb-0">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          ← Blog
        </a>
      </div>
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-card-foreground">
          The Hitchhiker's Guide to Video Compression: MP4 vs WebM vs AVI vs MOV
        </CardTitle>

        <div className="flex items-center gap-4 mt-6">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/ProfilePic.webp" alt="Mitchell Wintrow" />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              MW
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="text-sm font-medium text-card-foreground">
              Written by: Mitchell Wintrow
            </p>
            <p className="text-sm text-muted-foreground">
              June 13th, 2025 • 10:33 PM
            </p>
          </div>
        </div>

        <Separator className="mt-6" />
      </CardHeader>

      <CardContent className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">A Brief Intro to Video Compression</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Have you ever tried to upload a video to your website and watched in horror as the loading bar crawled at a snail's pace? 🐌 Or maybe you've recorded a quick 30-second demo only to discover the file is somehow larger than your entire website? Yeah, we've all been there, and it's about as fun as watching paint dry... on dial-up internet.
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Here's the thing: video compression is basically the art of making your videos smaller without making them look like they were filmed on a potato 🥔. Think of it like this - raw video data is like trying to stuff an entire wardrobe into a carry-on suitcase. Video compression is the magical folding technique that somehow makes everything fit while still keeping your clothes (mostly) wrinkle-free.
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          At its core, video compression works by being sneaky in two main ways:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Spatial compression</strong>: This looks at each frame and says "Hey, this blue sky has like 10,000 pixels that are all basically the same shade of blue. How about we just say 'blue pixels from here to here' instead?" It's like describing a wall as "all white" instead of listing every single brick.</li>
          <li><strong>Temporal compression</strong>: This is where things get really clever. Instead of storing every single frame completely, it only stores the differences between frames. So if you're recording yourself talking and the background doesn't change, why store that background 30 times per second? Just store it once and note what changes! 🎬</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          The magic happens when these techniques work together, turning your massive 2GB screen recording into a manageable 50MB file that still looks crisp. But here's where it gets interesting - different video formats (containers) and codecs (the actual compression algorithms) handle this magic in very different ways. Some are like Swiss Army knives 🔪 - versatile but not always the sharpest tool for every job. Others are more like specialized surgical instruments - incredibly effective for specific tasks but useless for anything else.
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "In the world of video compression, the heaviest files aren't always the strongest - sometimes the smallest warriors pack the mightiest punch." 💪
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">What's the Difference Between These Formats Anyway?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Alright, let's break down these video formats like we're comparing superhero teams 🦸‍♂️. Each one has its own superpowers, weaknesses, and that one weird quirk that makes you go "really?"
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">MP4 (MPEG-4 Part 14)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Think of MP4 as the Superman of video formats - it's everywhere, everyone recognizes it, and it pretty much always saves the day. This format:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Plays nice with everyone</strong>: From your grandma's ancient laptop to the latest iPhone, MP4 just works</li>
          <li><strong>Uses H.264/H.265 codecs</strong>: These are like the compression wizards that make your files small while keeping quality high</li>
          <li><strong>Supports streaming</strong>: Perfect for when you want your videos to start playing before they're fully loaded (because who has time to wait? ⏰)</li>
          <li><strong>File sizes</strong>: Generally gives you that sweet spot between quality and size</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">WebM</h3>
        <p className="text-lg text-muted-foreground mb-4">
          WebM is like the cool, open-source rebel of the group 😎. Created by Google, it's all about that web life:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Built for browsers</strong>: Specifically designed to make web videos load faster than you can say "buffering"</li>
          <li><strong>Uses VP8/VP9 codecs</strong>: These bad boys can compress videos even smaller than MP4 in many cases</li>
          <li><strong>Open and free</strong>: No licensing fees, which is music to any developer's ears 🎵</li>
          <li><strong>The catch</strong>: Not all browsers and devices support it (looking at you, Safari 👀)</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">AVI (Audio Video Interleave)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          AVI is the grizzled veteran - it's been around since Windows 3.1! 👴 Here's what you need to know:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Minimal compression</strong>: Often results in HUGE file sizes (like, "is this a video or the entire Lord of the Rings trilogy?" huge)</li>
          <li><strong>High quality</strong>: What it lacks in compression, it makes up for in pristine quality</li>
          <li><strong>Universal compatibility</strong>: If something can play video, it can probably play AVI</li>
          <li><strong>Best for</strong>: Local storage when quality matters more than file size</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">MOV (QuickTime File Format)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          MOV is Apple's golden child 🍎, and like most Apple products, it's beautiful but... complicated:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Excellent quality</strong>: Especially for high-resolution videos and professional editing</li>
          <li><strong>ProRes codec support</strong>: The format professionals drool over 🤤</li>
          <li><strong>The elephant in the room</strong>: File sizes that'll make your storage drive cry (remember my 315.9MB screen recording? Yeah, that was MOV)</li>
          <li><strong>Cross-platform issues</strong>: Works flawlessly on Mac, but Windows users might need to install QuickTime</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-4">
          Here's a quick comparison to really drive it home:
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-card border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Format</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">File Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Compatibility</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">Best Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-6 py-4 text-sm text-muted-foreground">MP4</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Small-Medium</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Universal</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Literally everything</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-muted-foreground">WebM</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Smallest</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Modern browsers</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Web optimization</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-muted-foreground">AVI</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Largest</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Universal</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Archival/Editing</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-muted-foreground">MOV</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Large</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Mac-focused</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Professional work</td>
              </tr>
            </tbody>
          </table>
        </div>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "Choose your format like you choose your battles - not every sword fits every warrior, and not every codec fits every purpose." ⚔️
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">How Do I Know When to Use One Format Over Another?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Alright, decision time! 🤔 Choosing the right video format is like picking the right outfit - you wouldn't wear a tuxedo to the gym, and you shouldn't use AVI for your website's hero video (unless you want your users to age while it loads).
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Let me break this down into real-world scenarios because that's how we actually make these decisions:
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">When to Use MP4</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <strong>Use MP4 when you want to play it safe</strong> 🛡️
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Website videos</strong>: Background videos, product demos, tutorials - MP4 is your reliable friend</li>
          <li><strong>Social media</strong>: Instagram, Twitter, LinkedIn - they all love MP4</li>
          <li><strong>Email attachments</strong>: When you need to send a video that just works</li>
          <li><strong>Mobile apps</strong>: Both iOS and Android will thank you</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          <strong>Pro tip</strong>: Use H.264 codec for maximum compatibility, or H.265 if you need even smaller files and your audience has newer devices.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">When to Use WebM</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <strong>Use WebM when every kilobyte counts</strong> 🪶
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Landing pages</strong>: Where load speed directly impacts conversion rates</li>
          <li><strong>Progressive web apps</strong>: When you're building for the modern web</li>
          <li><strong>High-traffic websites</strong>: Save on bandwidth costs (your wallet will thank you 💰)</li>
          <li><strong>When you control the environment</strong>: Like internal company tools where you know everyone uses Chrome</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          <strong>Real talk</strong>: I once switched a client's hero video from MP4 to WebM and shaved off 40% of the file size. Their page load time dropped by 2 seconds, and their bounce rate decreased by 15%. That's money in the bank! 🏦
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">When to Use AVI</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <strong>Use AVI when quality is king and file size is... not a concern</strong> 👑
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Video editing source files</strong>: When you need every pixel perfect for post-production</li>
          <li><strong>Archival purposes</strong>: Storing the master copy before compression</li>
          <li><strong>Local playback</strong>: When it's only playing from a hard drive, not the internet</li>
          <li><strong>Screen recordings for tutorials</strong>: Before you compress them for distribution</li>
        </ul>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">
            <strong>Warning</strong>: Seriously, don't use AVI for web delivery. I once had a client who insisted on using AVI for their product videos. Their homepage took 45 seconds to load. FORTY. FIVE. SECONDS. 😱 They're not a client anymore (just kidding, we fixed it with MP4).
          </p>
        </div>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">When to Use MOV</h3>
        <p className="text-lg text-muted-foreground mb-4">
          <strong>Use MOV when you're in Apple's ecosystem</strong> 🍎
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Final Cut Pro projects</strong>: MOV plays nicely with Apple's editing software</li>
          <li><strong>ProRes workflows</strong>: When color grading and quality are paramount</li>
          <li><strong>Mac-to-Mac transfers</strong>: When everyone involved has a Mac</li>
          <li><strong>Before converting</strong>: As a high-quality intermediate format</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          <strong>The MOV reality check</strong>: Remember my 315.9MB screen recording? That's MOV being MOV. Great quality, terrible for sharing. Always convert before uploading!
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Quick Decision Tree 🌳</h3>
        <div className="bg-gray-50 p-6 rounded-lg mb-8 font-mono text-sm">
          <pre className="whitespace-pre-wrap text-gray-700">
{`Is it for the web?
├─ Yes → Is Safari support critical?
│   ├─ Yes → MP4
│   └─ No → WebM (with MP4 fallback)
└─ No → Is it for editing?
    ├─ Yes → Are you on Mac?
    │   ├─ Yes → MOV
    │   └─ No → AVI
    └─ No → MP4 (it's always MP4)`}
          </pre>
        </div>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "The wise developer knows that the best format isn't the newest or the fanciest - it's the one that gets the job done without making users suffer." 🧘‍♂️
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">Why Is This Even Important For My Website?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Look, I get it. You might be thinking "Can't I just upload whatever and call it a day?" 🤷‍♂️ Sure, you could also eat soup with a fork, but why make life harder than it needs to be?
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Here's the cold, hard truth about why video formats matter more than you think:
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The 3-Second Rule ⏱️</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load. FIFTY-THREE PERCENT! That's more than half your potential customers gone before they even see your awesome content. And guess what's usually the biggest culprit for slow load times? That's right - your unoptimized 200MB hero video sitting there like a digital roadblock 🚧.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Google's Watching (And Judging) 👀</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Page speed is a direct ranking factor for Google. This means:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Slow site = Lower rankings</strong> = Less organic traffic</li>
          <li><strong>Less traffic = Fewer conversions</strong> = Less money</li>
          <li><strong>Less money = Sad developer</strong> 😢</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          I had a client whose e-commerce site was using massive MOV files for product videos. After converting everything to optimized MP4s and WebM with fallbacks, their:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Page load time dropped from 8.2 to 2.7 seconds</li>
          <li>Google rankings improved for 67% of their target keywords</li>
          <li>Conversion rate increased by 23%</li>
          <li>Monthly revenue jumped by $18,000 💸</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Bandwidth Bill From Hell 🔥</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Every time someone loads your page, you're paying for that bandwidth. Using a 50MB AVI instead of a 5MB MP4 means you're literally paying 10x more for hosting. It's like ordering 10 pizzas when you only need one - except less delicious and more expensive.
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          <strong>Real numbers</strong>: If your site gets 10,000 visitors/month:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>With 50MB videos: 500GB bandwidth = $$</li>
          <li>With 5MB videos: 50GB bandwidth = $</li>
          <li>That's potentially hundreds of dollars saved monthly!</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Mobile Users Will Hate You 📱</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Remember, over 60% of web traffic is mobile now. That means:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Data caps are real</strong>: Nobody wants to blow through their monthly data watching your hero video</li>
          <li><strong>Slower connections</strong>: Not everyone has 5G, and 4G can be spotty</li>
          <li><strong>Battery drain</strong>: Large videos = more processing = dead phones = angry users</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Trust and Professionalism 🤝</h3>
        <p className="text-lg text-muted-foreground mb-6">
          This is the one nobody talks about, but it's huge. When your site loads fast and videos play smoothly:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Users trust you more (subconsciously associating speed with competence)</li>
          <li>They're more likely to stay and explore</li>
          <li>They're more likely to come back</li>
          <li>They're more likely to recommend you</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          But when your site is slow? It screams "amateur hour" louder than a foghorn 📯. Users think: "If they can't even get their website right, can I trust them with my credit card?"
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Monetization Connection 💰</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Whether you're running ads, selling products, or monetizing content through Medium (hey there, fellow Medium writer! 👋), performance directly impacts your bottom line:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Ad revenue</strong>: Slow sites = higher bounce rates = fewer ad impressions</li>
          <li><strong>Affiliate links</strong>: People can't click what they don't wait to see</li>
          <li><strong>Product sales</strong>: Every second of load time can decrease conversions by 7%</li>
          <li><strong>Content monetization</strong>: Readers won't wait for your brilliant article to load</li>
        </ul>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "A website's speed is like a first impression - you only get one chance, and if you blow it, they're swiping left faster than you can say 'please wait, loading...'" 💨
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">Conclusion</h2>

        <p className="text-lg text-muted-foreground mb-6">
          So there you have it, fellow digital adventurers! 🚀 We've journeyed through the wild world of video formats, and hopefully, you're no longer looking at MP4, WebM, AVI, and MOV like they're mysterious alien languages.
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          Here's your TL;DR cheat sheet:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>MP4</strong>: Your reliable, go-everywhere friend</li>
          <li><strong>WebM</strong>: The speed demon for modern web</li>
          <li><strong>AVI</strong>: The quality beast for local storage</li>
          <li><strong>MOV</strong>: Apple's heavyweight champion</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-4">
          But more importantly, you now know that choosing the right video format isn't just some nerdy technical decision - it's about:
        </p>
        <ul className="list-none space-y-2 text-muted-foreground mb-6">
          <li>✅ Keeping your users happy (and on your site)</li>
          <li>✅ Making Google love you (hello, better rankings! 👋)</li>
          <li>✅ Saving money on hosting (cha-ching! 💰)</li>
          <li>✅ Building trust and looking professional</li>
          <li>✅ Actually making money from your content</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          The next time you're about to upload a video to your website, take a second to ask yourself: "Is this format working for me, or am I working for it?" Because life's too short for slow-loading websites and frustrated users.
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Now go forth and compress those videos! Your users (and your wallet) will thank you. And hey, if you found this helpful, drop a clap on Medium or share it with that friend who's still uploading raw MOV files to their website. We all know one 😅
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "In the grand adventure of web development, the smallest optimizations often lead to the biggest victories. May your videos be compressed and your load times be swift!" ⚡
        </blockquote>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-4 pt-8 border-t">
        <div className="text-center max-w-2xl">
          <h3 className="text-2xl font-bold mb-3 text-card-foreground">
            Ready to Optimize Your Videos? 🚀
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            Stop letting huge video files slow down your website! Try our free video compression tool and see the difference instantly. Convert MP4, WebM, AVI, MOV and more with just a few clicks.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-lg"
            onClick={() => {
              mixpanel.track('Video Compression Guide - Try Video Converter Free', {
                user_tier: 'free'
              });
            }}
          >
            <a href="/">Try Video Converter Free →</a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            No signup required • Process files locally • Fast & secure
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCompressionGuide;
