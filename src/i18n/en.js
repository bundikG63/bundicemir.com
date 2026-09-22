import * as bs from '../data/content.js'
export default {
  site: bs.site,
  nav: [{ href: '#projekti', label: 'Projects' }, { href: '#o-meni', label: 'About' }, { href: '#vjestine', label: 'Skills' }],
  hero: {
    ...bs.hero,
    titleA: 'I turn ideas', titleB: 'into', titleAccent: 'code that works.',
    text: 'I build custom FiveM scripts, web solutions and systems that bring everything together into one functional whole.',
    primary: 'Explore my work', secondary: 'My GitHub', scroll: 'EXPLORE THE PORTFOLIO',
  },
  specialties: ['Custom development', 'FiveM systems', 'Web experiences', 'API integrations'],
  projects: {
    eyebrow: '01 / SELECTED WORK', title: 'From code to', titleAccent: 'experience.',
    lead: 'Projects I have worked on as part of Godzilla Development.',
    featured: {
      ...bs.projects.featured,
      tags: ['FiveM', 'Web', 'Integrations'], title: 'One server. A connected ecosystem.',
      text: 'Developing a custom launcher and connecting a website to a FiveM server. Systems designed to make it easier for players and the team to access the community and its features.',
      more: 'The work includes a launcher for accessing the server, connecting the website and server, and integrating a news system. The focus is on making separate components work together.',
    },
    list: [
      {
        ...bs.projects.list[0], title: 'Police systems with more depth.',
        text: 'Custom police scripts with forensics and an MDT for a more structured roleplay experience and police teamwork.',
        tags: ['FiveM', 'MDT', 'Forensics'],
        more: 'Police features brought together: digital records through an MDT and forensic elements that expand the possibilities of investigative roleplay.',
      },
      {
        ...bs.projects.list[1], title: 'Jobs that keep the city moving.',
        text: 'Scripts for trucking, taxi driving, excavator operation, mining and towing, alongside a custom admin system for the server team.',
        tags: ['Gameplay', 'Jobs', 'Admin tools'],
        more: 'Developing different gameplay flows tailored to the community. Administrative tools support the day-to-day work of the team running the server.',
      },
    ],
  },
  about: {
    ...bs.about, eyebrow: '02 / BEHIND THE CODE', role: 'Developer. Creator. Problem solver.', githubLabel: 'My GitHub',
    large: 'What interests me most is the moment an idea becomes something people can actually use.',
    paragraphs: [
      'My work brings together web development, custom FiveM scripts and integrations. Through Godzilla Development, I work on features that connect the player experience with community management tools.',
      'I like to understand the whole problem: what the user needs, how the system should work and how to connect its parts into a coherent whole.',
    ],
    skills: ['Lua', 'JavaScript', 'HTML & CSS', 'SQL', 'FiveM', 'API integrations'], skillsLink: 'Explore my skills',
  },
  skills: {
    eyebrow: '03 / DEVELOPMENT SKILLS', title: 'The knowledge behind every', titleAccent: 'project.',
    list: [
      { ...bs.skills.list[0], text: 'Developing and adapting scripts for roleplay servers: from jobs and interactions to police features and admin tools.', tags: ['Lua', 'FiveM', 'Gameplay logic'] },
      { ...bs.skills.list[1], text: 'Building web interfaces and interactive features that help users explore the server and its content.' },
      { ...bs.skills.list[2], label: 'DATA & SYSTEMS', title: 'SQL & databases', text: 'Working with data and SQL queries for server scripts, adapting database structures to the needs of individual features.', tags: ['SQL', 'Databases', 'Server data'] },
      { ...bs.skills.list[3], label: 'INTEGRATIONS', title: 'Web, server & launcher', text: 'Connecting the website, FiveM server and custom launcher, with API integrations and Discord webhooks for notifications.', tags: ['API integrations', 'Discord webhooks', 'Custom launcher'] },
    ],
  },
  services: {
    eyebrow: '04 / WHAT I BUILD', title: 'Your idea. My next challenge.',
    list: [
      { title: 'Web solutions', text: 'Portfolio websites, presentation sites and web interfaces tailored to the purpose of each project.' },
      { title: 'FiveM development', text: 'Custom scripts, gameplay systems and server administration tools.' },
      { title: 'Connected systems', text: 'Integrating websites, servers and other tools into a shared workflow.' },
    ],
  },
  contact: { eyebrow: '05 / THE NEXT PROJECT', title: 'Have an idea?', titleAccent: 'Let’s build it.', text: 'Visit my GitHub profile and let’s connect about the next project.', button: 'Find me on GitHub', navLabel: 'Let’s talk' },
}
