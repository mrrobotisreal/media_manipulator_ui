import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import mixpanel from 'mixpanel-browser';

const ImageOptimizationGuide: React.FC = () => {
  useEffect(() => {
    mixpanel.track('Page View', {
      page_name: 'Image Optimization Guide',
      page_path: '/blog/image/image-optimization-guide',
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
          Image Optimization for Web Jedis: JPG vs PNG vs WebP
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
              June 14th, 2025 • 5:32 PM
            </p>
          </div>
        </div>

        <Separator className="mt-6" />
      </CardHeader>

      <CardContent className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">A Brief Intro to Image Formatting</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Ever uploaded an image to your website and wondered why it takes <em>forever</em> to load? Or maybe you've noticed that your beautiful PNG logo looks crisp and clean, but it's somehow 5MB for a simple graphic? 🤔 Welcome to the wild world of image formats, where choosing the wrong one can make the difference between a lightning-fast website and one that loads slower than dial-up internet (remember that? 😅).
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Image formats are essentially different ways of encoding and storing visual data. Think of them like different languages for describing the same picture - some are more verbose and detailed (like PNG), while others are more concise and compressed (like JPG). Each format has its own special sauce for how it stores pixels, handles transparency, compresses data, and maintains quality.
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          At their core, all image formats are trying to solve the same problem: how do we store millions of pixels worth of color information in a file that doesn't break the internet when someone tries to download it? The answer lies in <em>compression</em> - and this is where things get interesting! Some formats use "lossy" compression (they throw away some data to save space), while others use "lossless" compression (they keep everything but find clever ways to pack it smaller). It's like the difference between summarizing a book versus shrinking the font size - both make it "smaller," but one loses information while the other doesn't.
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          The three amigos we'll be diving into today - JPG, PNG, and WebP - each approach this challenge differently, and understanding their unique superpowers (and kryptonite!) will transform you from a Padawan into a true Web Jedi. 🚀
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "The wise developer knows that the heaviest burden on a website is not code, but unoptimized images." - Ancient Web Proverb 😉
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">What's the Difference Between These Formats Anyway?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Alright, let's get into the nitty-gritty of what makes each format tick! Think of these formats as different types of vehicles - they'll all get you from point A to point B, but some are sports cars, some are trucks, and some are those fancy new electric vehicles that do everything. 🚗
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">JPG (or JPEG - they're the same thing, don't let anyone tell you otherwise 😄)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          JPG is like that reliable friend who's great at parties but terrible with details. It uses lossy compression, which means it literally throws away data it thinks you won't notice. Perfect for photographs where a tiny bit of quality loss is invisible to the human eye, but terrible for text or sharp edges. Ever seen a meme that's been shared so many times it looks like it was photographed through a potato? That's JPG compression artifacts saying hello! 👋
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Pros</strong>: Small file sizes, universally supported, great for photos</li>
          <li><strong>Cons</strong>: No transparency support, loses quality with each save, makes text look fuzzy</li>
          <li><strong>Best for</strong>: Photographs, complex images with lots of colors</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">PNG (Portable Network Graphics)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          PNG is the perfectionist of the group - it refuses to lose any data whatsoever. Using lossless compression, it keeps every single pixel exactly as you intended. It also supports transparency (hello, logos with no background! 🎉), making it the go-to choice for graphics, icons, and anything with text. The downside? File sizes can get chunky real quick, especially with large, complex images.
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Pros</strong>: Lossless compression, supports transparency, perfect for graphics and text</li>
          <li><strong>Cons</strong>: Larger file sizes, not ideal for photographs</li>
          <li><strong>Best for</strong>: Logos, icons, images with text, anything needing transparency</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">WebP (The New Kid on the Block)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          WebP is Google's attempt to create the ultimate image format - and honestly, they kind of nailed it! 🎯 It's like the Swiss Army knife of image formats, supporting both lossy AND lossless compression, transparency, and even animation (move over, GIF!). It typically achieves 25-35% smaller file sizes than JPG and PNG while maintaining the same quality. The only catch? Not every browser plays nice with it yet (looking at you, older Safari versions 👀).
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Pros</strong>: Smaller file sizes, supports everything (lossy, lossless, transparency, animation), excellent quality-to-size ratio</li>
          <li><strong>Cons</strong>: Not universally supported (yet), requires fallbacks for older browsers</li>
          <li><strong>Best for</strong>: Modern websites where you can provide fallbacks, any use case really!</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          Here's a quick real-world example: A 1920x1080 photo might be 500KB as a JPG, 2MB as a PNG, but only 350KB as a WebP - with virtually identical visual quality. That's like getting a luxury car for the price of a compact! 🏎️
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "Choose your format as a samurai chooses their sword - with purpose, precision, and an understanding of its strengths and weaknesses." ⚔️
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">How Do I Know When to Use One Format Over Another?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          This is where the rubber meets the road! 🏁 Choosing the right format isn't rocket science, but it does require thinking like a detective. Let me break down the decision-making process with some real-world scenarios that'll make you go "Aha!" 💡
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Quick Decision Tree (Screenshot This! 📸)</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Ask yourself these questions in order:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Does it need transparency? → If yes, PNG or WebP</li>
          <li>Is it a photograph with lots of colors and gradients? → JPG or WebP</li>
          <li>Does it have text or sharp edges? → PNG or WebP</li>
          <li>Do I need the absolute smallest file size? → WebP (with JPG/PNG fallback)</li>
          <li>Is it going to be edited and saved multiple times? → PNG (to avoid quality degradation)</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Real-World Scenarios (Because Theory is Boring 😴)</h3>

        <h4 className="text-xl font-semibold mt-6 mb-3 text-card-foreground">Scenario 1: Your Company Logo</h4>
        <p className="text-lg text-muted-foreground mb-4">
          You've got a slick logo that needs to work on any background. This is PNG territory all day! Why? You need that transparency, baby! Plus, logos typically have clean lines and solid colors that PNG handles like a boss. If you're feeling adventurous and your analytics show most users have modern browsers, go WebP with PNG fallback.
        </p>

        <h4 className="text-xl font-semibold mt-6 mb-3 text-card-foreground">Scenario 2: Hero Image on Your Landing Page</h4>
        <p className="text-lg text-muted-foreground mb-4">
          That gorgeous 4K photograph of your product/team/artisanal coffee? JPG or WebP, no question. The slight quality loss from JPG compression is invisible in photographs, and the file size difference is *chef's kiss* 👨‍🍳. A 5MB PNG photo will make your users cry (and bounce), while a 500KB JPG will load faster than they can say "add to cart."
        </p>

        <h4 className="text-xl font-semibold mt-6 mb-3 text-card-foreground">Scenario 3: Screenshots for Your Blog/Documentation</h4>
        <p className="text-lg text-muted-foreground mb-4">
          This one's tricky! If there's text in the screenshot (and there usually is), PNG is your friend. JPG will make that text look like it went through a blender. However, if you're taking screenshots on a Mac, those bad boys can be HUGE. Consider using WebP or optimizing your PNGs with tools like TinyPNG.
        </p>

        <h4 className="text-xl font-semibold mt-6 mb-3 text-card-foreground">Scenario 4: Product Images for E-commerce</h4>
        <p className="text-lg text-muted-foreground mb-4">
          WebP with JPG fallback is the power move here. 🎯 You get smaller file sizes (faster load times = better conversions), great quality, and you can even add subtle transparency effects if needed. Just make sure to implement proper fallbacks for the Safari-on-iPhone crowd.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Pro Tips from the Trenches 🪖</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Always compress your images! Even if you choose the right format, an unoptimized PNG can still be a monster</li>
          <li>Use responsive images with different sizes for different devices (your mobile users will thank you)</li>
          <li>Consider using CDNs that can automatically serve WebP to supported browsers</li>
          <li>When in doubt, test both formats and see which looks better at a reasonable file size</li>
        </ul>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "The master web developer doesn't choose the format that looks best, but the one that serves the user best - for in serving others, we optimize ourselves." 🧘‍♂️
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">Why Is This Even Important For My Website?</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Okay, real talk time. 💯 You might be thinking, "Come on, it's 2025, everyone has fast internet now, right?" WRONG! Let me hit you with some truth bombs that'll make you want to optimize every image on your site immediately. 💣
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Brutal Reality of Page Load Times</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Here's a stat that'll make your jaw drop: <strong>53% of mobile users abandon sites that take longer than 3 seconds to load</strong>. THREE. SECONDS. 😱 And guess what's usually the biggest culprit? Yep, those chunky, unoptimized images you uploaded straight from your camera.
        </p>

        <p className="text-lg text-muted-foreground mb-4">
          Let's do some quick math (don't worry, I'll keep it simple):
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Average webpage: 2-3MB total</li>
          <li>Unoptimized hero image: 5MB</li>
          <li>Result: Your page just became slower than a sloth on sedatives 🦥</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The SEO Domino Effect 🎯</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Google's Core Web Vitals (fancy term for "does your site load fast?") directly impact your search rankings. Here's the chain reaction:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Heavy images → Slow load times</li>
          <li>Slow load times → Poor Core Web Vitals scores</li>
          <li>Poor scores → Lower search rankings</li>
          <li>Lower rankings → Less traffic</li>
          <li>Less traffic → Less money 💸</li>
        </ol>

        <p className="text-lg text-muted-foreground mb-6">
          It's like a really expensive game of dominoes where every piece that falls costs you customers!
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Mobile Reality Check 📱</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Here's something that might surprise you: In many parts of the world, people are browsing on 3G connections or have data caps. That beautiful 10MB PNG hero image? It just cost someone in India half their daily data allowance. Not cool, and definitely not good for business.
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Plus, even in countries with "fast" internet, people are often on spotty coffee shop WiFi or riding the subway. Your unoptimized images are literally making people close your site and go to your competitor. Ouch! 🤕
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Money Talk (Because Let's Be Honest, That's What Matters) 💰</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Amazon found that every 100ms of latency cost them 1% in sales</strong></li>
          <li><strong>Pinterest increased search engine traffic and sign-ups by 15% when they reduced perceived wait times by 40%</strong></li>
          <li><strong>Walmart saw a 2% increase in conversions for every 1 second of improvement in load time</strong></li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          Still think image optimization doesn't matter? 🤔
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Real-World Horror Story 🎃</h3>
        <p className="text-lg text-muted-foreground mb-6">
          I once worked with a client whose beautiful photography portfolio site was getting almost no traffic. The culprit? Each image was a 15-20MB PNG straight from Photoshop. The homepage took 45 seconds to load on a good day. After optimizing (converting to JPG, proper sizing, lazy loading), load time dropped to 2 seconds. Traffic increased by 70% in one month. True story!
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Trust Factor 🤝</h3>
        <p className="text-lg text-muted-foreground mb-4">
          Slow websites don't just lose customers - they lose credibility. Users subconsciously associate slow load times with:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li>Outdated technology</li>
          <li>Lack of attention to detail</li>
          <li>Unprofessionalism</li>
          <li>Security concerns (yes, really!)</li>
        </ul>

        <p className="text-lg text-muted-foreground mb-6">
          Your image choices are literally affecting how trustworthy people think you are. Wild, right?
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "A website's speed is like a first impression - you never get a second chance to load quickly." ⚡
        </blockquote>

        <h2 className="text-3xl font-semibold mt-12 mb-6 text-card-foreground">Conclusion</h2>

        <p className="text-lg text-muted-foreground mb-6">
          Alright, my fellow Web Jedis, we've been on quite the journey! 🚀 From understanding the DNA of image formats to seeing how they can literally make or break your website's success. Let's recap the superpowers you've just unlocked:
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The TL;DR Version (For Those Who Scrolled Here First 😏)</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>JPG</strong>: Your go-to for photos. Small files, great quality, but no transparency</li>
          <li><strong>PNG</strong>: The perfectionist for logos, graphics, and anything with text. Bigger files but pixel-perfect</li>
          <li><strong>WebP</strong>: The Swiss Army knife that does it all, just needs fallbacks for older browsers</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">Your Action Plan (Do These TODAY!) ✅</h3>
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-muted-foreground">
          <li><strong>Audit your current images</strong> - Open your website right now and check those file sizes. I'll wait... Scary, right? 😱</li>
          <li><strong>Set up an optimization workflow</strong> - Whether it's using tools like TinyPNG, ImageOptim, or good ol' ffmpeg (shameless plug for my other article 😉), make optimization part of your process</li>
          <li><strong>Implement WebP with fallbacks</strong> - It's 2025, time to give your users that next-gen experience</li>
          <li><strong>Test your load times</strong> - Use Google's PageSpeed Insights and watch those scores soar</li>
          <li><strong>Set up responsive images</strong> - Different sizes for different devices = happy users everywhere</li>
        </ol>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">The Bigger Picture 🖼️</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Remember, optimizing your images isn't just about technical SEO scores or saving bandwidth (though those are awesome bonuses!). It's about respecting your users' time, data, and experience. Every second you shave off your load time is a second you're giving back to someone's day. That's pretty powerful when you think about it! 💪
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Plus, let's be real - faster websites make more money. It's not rocket science, it's just good business. Your optimized images are literally increasing your bottom line while making the web a better place. You're basically a superhero now! 🦸‍♀️🦸‍♂️
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4 text-card-foreground">One Final Challenge 🎯</h3>
        <p className="text-lg text-muted-foreground mb-6">
          Here's my challenge to you: Take the slowest-loading page on your website and optimize just the images. Nothing else. I guarantee you'll see at least a 50% improvement in load time. Share your before/after results in the comments - I love a good optimization success story!
        </p>

        <p className="text-lg text-muted-foreground mb-6">
          Remember, in the world of web development, the best code is fast code, but the best images are optimized images. Now go forth and compress! May your images be small and your load times be smaller! 🚀✨
        </p>

        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-lg text-muted-foreground mb-8">
          "The journey of a thousand optimizations begins with a single compressed image." 🏔️
        </blockquote>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-4 pt-8 border-t">
        <div className="text-center max-w-2xl">
          <h3 className="text-2xl font-bold mb-3 text-card-foreground">
            Time to Become an Image Optimization Jedi! 🌟
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            Ready to transform your chunky PNGs into lightning-fast WebPs? Our free image converter supports JPG, PNG, WebP, GIF and more. Optimize your images in seconds and watch your website fly!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 text-lg"
            onClick={() => {
              mixpanel.track('Image Optimization Guide - Convert Images Free', {
                user_tier: 'free'
              });
            }}
          >
            <a href="/">Convert Images Free →</a>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            No signup required • Process files locally • Fast & secure
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageOptimizationGuide;
