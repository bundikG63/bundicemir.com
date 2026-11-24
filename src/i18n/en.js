import * as bs from '../data/content.js'

const [tandemettle, letterpilot, faco, godzilla] = bs.work.items

export default {
  site: bs.site,
  nav: [
    { href: '#projekti', label: 'Projects' },
    { href: '#o-meni', label: 'About' },
    { href: '#kontakt', label: 'Contact' },
  ],
  hero: {
    line: 'I turn ideas into code that works.',
    text: 'I build web products, desktop apps and FiveM systems. Below are four projects, and you can open three of them right now.',
    primary: 'See the projects',
    secondary: 'Write to me',
  },
  work: {
    title: 'Projects',
    open: 'Open {name}',
    count: 'Project {n} of {total}',
    items: [
      {
        ...tandemettle,
        headline: 'AI services for small businesses in Germany.',
        text: 'The website and tools of a company that brings AI into the work small teams already do: automation, a customer chatbot and consulting.',
        facts: [
          'A time-savings calculator that neither stores nor sends what you enter',
          'A chat assistant that answers from the published services and FAQ',
          'A service request and a PDF services overview in one place',
        ],
      },
      {
        ...letterpilot,
        headline: 'Official letters, explained in plain language.',
        text: 'You upload a PDF or a photo of the letter and get an explanation in your language and a formal reply drafted in German as an A4 PDF.',
        facts: [
          'Every deadline and amount shows the passage of the letter it comes from',
          'Explanations in German, English, Bosnian, Croatian, Serbian and Turkish',
          'Two documents free, then packs or a monthly subscription',
        ],
      },
      {
        ...faco,
        headline: 'A personal AI assistant for Windows.',
        text: 'A desktop app that talks, keeps your tasks and works with files on your computer, with a cloud model or fully local.',
        facts: [
          'Every change on disk and every command waits for your confirmation',
          'Works with Anthropic, OpenAI-compatible services and local models through Ollama',
          'API keys stay in the Windows Credential Manager',
        ],
      },
      {
        ...godzilla,
        headline: 'A FiveM roleplay server with its own systems.',
        text: 'Custom scripts, a launcher and a website connected to the server. The systems were written for this community, not bought and pasted in.',
        credits: [
          { label: 'Police', items: ['MDT', 'Forensics', 'Dispatch', 'SEK unit'] },
          { label: 'Jobs', items: ['Trucker', 'Taxi', 'Excavator', 'Miner', 'Towing', 'Fisher'] },
          { label: 'Crime', items: ['Jewellery heist', 'Armoured truck', 'Small robberies', 'Chop shop'] },
          { label: 'City', items: ['Apartments and safes', 'Hospital and EMS', 'Fight Club', 'Documents'] },
          { label: 'Server team', items: ['Admin system', 'Anticheat', 'Launcher', 'Web and server'] },
        ],
      },
    ],
  },
  about: {
    title: 'About',
    large: 'What interests me most is the moment an idea becomes something people can actually use.',
    paragraphs: [
      'I build web products, desktop apps and custom FiveM scripts. On every project I go the whole way: from the first sketch to a version that is published and running.',
      'I like to understand the whole problem: what the user needs, how the system should work and how to connect its parts into a coherent whole.',
    ],
    toolsTitle: 'What I work with',
    tools: [
      { label: 'Web', items: 'JavaScript, TypeScript, React, Next.js, HTML and CSS' },
      { label: 'Desktop', items: 'Tauri, Rust' },
      { label: 'Data', items: 'SQL, SQLite, Supabase' },
      { label: 'Games', items: 'Lua, FiveM' },
      { label: 'Integrations', items: 'API integrations, Stripe, Discord webhooks' },
    ],
    servicesTitle: 'What I can build',
    services: [
      { title: 'Web products', text: 'From a presentation site to an app with sign-in, payments and a database.' },
      { title: 'Desktop apps', text: 'Windows programs with their own interface, a local database and safe key storage.' },
      { title: 'FiveM systems', text: 'Custom scripts, gameplay systems and tools for the team running the server.' },
      { title: 'Connected systems', text: 'Website, server, launcher and outside services joined into one workflow.' },
    ],
  },
  contact: {
    title: 'Have an idea?',
    text: 'Tell me what you are building and where you got stuck.',
    email: 'Send an email',
    github: 'GitHub profile',
  },
  footer: { top: 'Back to top' },
}
