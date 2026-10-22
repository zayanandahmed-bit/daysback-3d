// Articles for /insights. Plain data (no JSX) so vite.config.js can read the
// titles and descriptions to build a real HTML file per article for Google.
// Body blocks: ['h2', text] | ['p', text] | ['ul', [items]]

export const ARTICLES = [
  {
    slug: 'what-is-an-ai-receptionist',
    title: 'What Is an AI Receptionist? How It Works for Small Businesses',
    description:
      'An AI receptionist answers every call, books appointments and follows up, day or night. Here is how it works, who it suits, and how to get started.',
    date: '2026-10-22',
    read: '5 min read',
    body: [
      ['p', "Every missed call is a customer who might ring the next business on the list. For most small teams the problem isn't demand, it's that nobody is free to pick up: you're with a client, on a job, or it's 9pm. An AI receptionist fixes exactly that gap."],
      ['h2', 'What an AI receptionist actually does'],
      ['p', 'It is a voice agent connected to your phone number. When a call comes in, it answers in a natural voice, understands what the caller wants, and handles it the way you would:'],
      ['ul', [
        'Answers common questions: prices, opening hours, location, services',
        'Books, moves or cancels appointments straight into your calendar',
        'Takes a message and sends it to you by text, WhatsApp or email',
        'Qualifies new enquiries so you only call back the serious ones',
        'Hands the call to a real person when it should',
      ]],
      ['h2', 'How it works behind the scenes'],
      ['p', 'Your business number forwards to the AI when you are busy or after hours (or always, if you prefer). The AI is set up with your services, prices, availability and tone of voice, and connected to the tools you already use, such as Google Calendar, your booking system or your CRM. Every call is logged with a short summary so nothing gets lost.'],
      ['h2', 'Who it suits best'],
      ['ul', [
        'Clinics, dentists, physios and salons that live on bookings',
        'Trades and home services who are on a job when the phone rings',
        'Estate agents, solicitors and accountants with lots of first enquiries',
        'Any business that gets calls outside office hours',
      ]],
      ['h2', 'Will callers know it is AI?'],
      ['p', 'Modern voice agents sound natural and respond in real time, but we always recommend being upfront. A simple "you are speaking with our assistant" keeps trust high, and callers mostly care that they got a quick, useful answer.'],
      ['h2', 'Getting started'],
      ['p', 'A good AI receptionist is built around how your business actually runs, not a generic script. At DaysBack we map your calls, write the flows with you, connect your calendar and number, and have it live in under 5 working days. Book a free 27-minute strategy call and we will show you what it would handle for you.'],
    ],
  },
  {
    slug: 'tasks-every-small-business-should-automate',
    title: '12 Tasks Every Small Business Should Automate',
    description:
      'From lead follow-up to invoices and reviews: 12 everyday tasks small businesses can hand to automation and AI, and get hours back every week.',
    date: '2026-10-22',
    read: '6 min read',
    body: [
      ['p', "Most businesses don't need a big digital transformation. They need the same dozen jobs that eat every week to quietly do themselves. Here are the ones we automate most often, roughly in order of how fast they pay back."],
      ['h2', 'Sales and leads'],
      ['ul', [
        '1. Instant lead follow-up: every new enquiry gets a reply in seconds, by text, WhatsApp or email.',
        '2. Missed-call text back: anyone you could not answer gets a message with a booking link.',
        '3. Lead qualification: an AI asks the key questions and only passes you the serious ones.',
        '4. Quote generation: details in, branded quote out, without retyping anything.',
      ]],
      ['h2', 'Customers'],
      ['ul', [
        '5. Appointment booking and reminders, which cut no-shows.',
        '6. FAQ answers on your website and WhatsApp, around the clock.',
        '7. Review requests sent automatically after every job.',
        '8. Onboarding: contracts, welcome packs and forms sent the moment a deal is won.',
      ]],
      ['h2', 'Admin and money'],
      ['ul', [
        '9. Invoice chasing on a polite schedule, until it is paid.',
        '10. Data entry between your inbox, spreadsheets and CRM.',
        '11. Inbox triage: sorting, labelling and drafting replies to routine emails.',
        '12. A daily or weekly business briefing, written for you from your own numbers.',
      ]],
      ['h2', 'Where to start'],
      ['p', 'Pick the task that is either most repetitive or most expensive when it goes wrong. For most service businesses that is lead follow-up or missed calls, because a slow reply loses the sale entirely. Automate one thing, see the result, then add the next.'],
      ['p', 'Not sure which would save you the most? On a free 27-minute strategy call we look at how you actually run and point out the two or three automations worth doing first.'],
    ],
  },
  {
    slug: 'speed-to-lead',
    title: 'Speed to Lead: Why Replying in Minutes Wins More Customers',
    description:
      'The business that replies first usually wins the customer. How to answer every lead within minutes, even when you are busy, using simple automation.',
    date: '2026-10-22',
    read: '4 min read',
    body: [
      ['p', 'When someone fills in your form or messages you, they are usually contacting two or three other businesses too. The one that replies first, with something useful, is the one most likely to get the job. That is speed to lead.'],
      ['h2', 'Why fast replies matter so much'],
      ['ul', [
        'Interest is highest the moment someone enquires, and fades quickly',
        'A fast reply signals that you are organised and reliable',
        'Being first lets you set the price and the next step, before competitors do',
      ]],
      ['h2', 'Why most businesses are slow'],
      ['p', "It is rarely laziness. Leads arrive while you are working, in different places (website, email, WhatsApp, Instagram, phone), and get answered when someone has a spare moment, often hours later. By then the customer has booked elsewhere."],
      ['h2', 'How to reply in minutes without hiring'],
      ['ul', [
        'Route every enquiry, from every channel, into one place automatically',
        'Send an instant, personal-sounding reply with the next step, like a booking link or a couple of questions',
        'Let an AI assistant answer common questions and qualify the lead',
        'Alert you only for the leads that are ready to talk',
        'Follow up automatically if they go quiet',
      ]],
      ['h2', 'The result'],
      ['p', 'You stay in control of the conversations that matter, while nobody waits hours for a first answer. At DaysBack this is usually the first system we build for a client, because it starts paying for itself within weeks. We promise a reply within 1 hour ourselves, so we know how much it matters.'],
    ],
  },
  {
    slug: 'whatsapp-automation-for-business',
    title: 'WhatsApp Automation for Business: What You Can Automate',
    description:
      'Customers already message you on WhatsApp. Here is what you can automate there, from instant replies and bookings to reminders and follow-ups.',
    date: '2026-10-22',
    read: '5 min read',
    body: [
      ['p', "For many customers WhatsApp is the easiest way to reach a business. The catch is that every message needs a human, which doesn't scale. With the WhatsApp Business Platform you can automate the repetitive parts and keep the personal touch for the conversations that need it."],
      ['h2', 'What you can automate on WhatsApp'],
      ['ul', [
        'Instant replies to new messages, any time of day',
        'An AI assistant that answers questions about your services and prices',
        'Appointment booking, confirmations and reminders',
        'Follow-ups for quotes and enquiries that went quiet',
        'Order updates, delivery tracking and receipts',
        'Review requests after a job is done',
      ]],
      ['h2', 'Keeping it personal'],
      ['p', 'Good automation does not feel like a robot. Messages use the customer\'s name and context, the AI hands over to a person when the question needs one, and your team can step into any conversation at any time.'],
      ['h2', 'Rules worth knowing'],
      ['p', 'WhatsApp has clear rules: customers need to have opted in, and messages you send first (outside a 24-hour reply window) use pre-approved templates. Following them keeps your number in good standing, and we set this up properly from day one.'],
      ['h2', 'Is it worth it?'],
      ['p', 'If a meaningful share of your enquiries already come in on WhatsApp, almost certainly. It is one of the fastest ways to reply to leads in seconds and stop customers slipping through. Book a free 27-minute strategy call and we will map out what your WhatsApp could handle.'],
    ],
  },
  {
    slug: 'ai-chatbot-vs-live-chat',
    title: 'AI Chatbot vs Live Chat: Which Does Your Website Need?',
    description:
      'Live chat needs someone online. An AI chatbot answers instantly, 24/7. The pros and cons of each, and why most small businesses do best with both.',
    date: '2026-10-22',
    read: '4 min read',
    body: [
      ['p', 'A chat box on your website can turn visitors into enquiries, but only if someone answers. That is the real difference between live chat and an AI chatbot.'],
      ['h2', 'Live chat'],
      ['ul', [
        'A real person replies, which is great for complex or sensitive questions',
        'Only works when someone is online and free',
        'Unanswered chats often feel worse than having no chat at all',
      ]],
      ['h2', 'AI chatbot'],
      ['ul', [
        'Answers instantly, 24/7, in a natural conversational way',
        'Trained on your own services, prices and policies',
        'Can qualify the visitor, collect details and book a call',
        'Needs good setup and clear limits, so it never makes things up',
      ]],
      ['h2', 'The best of both'],
      ['p', 'For most small businesses the answer is an AI chatbot that handles the first conversation, and a smooth hand-off to a human when it is needed. Visitors get an instant answer, and your team only steps in for the conversations that need them.'],
      ['h2', 'What to look for'],
      ['ul', [
        'It knows your business, not just generic answers',
        'It is honest when it does not know, and offers a human instead',
        'It sends you the lead with a summary of the conversation',
        'It matches your brand and tone',
      ]],
      ['p', "You can try ours on this site: it is a live AI assistant that knows what DaysBack does. If you'd like one like it on your own website, book a free 27-minute strategy call."],
    ],
  },
];
