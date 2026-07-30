export const testimonials = [
  {
    name: 'Pastor John Adebayo',
    role: 'Chaplain, Lagos',
    content: 'The training I received through IIPEC has transformed my ministry. I now serve with greater compassion and effectiveness.',
  },
  {
    name: 'Sister Mary Okafor',
    role: 'Volunteer Chaplain',
    content: 'Being part of this movement has given me purpose and direction. I am now able to serve my community with love and excellence.',
  },
  {
    name: 'Rev. David Williams',
    role: 'Prison Ministry Coordinator',
    content: 'IIPEC equips chaplains with the skills and heart needed to make a real difference in people\'s lives.',
  },
];

export const carouselTestimonials = testimonials.map(t => ({
  quote: t.content,
  author: t.name,
  role: t.role,
}));
