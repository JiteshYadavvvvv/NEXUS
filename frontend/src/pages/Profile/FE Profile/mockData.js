export const profileData = {
  id: 'se-1',
  name: 'ROMEO',
  email: 'romeo_240114@aitpune.edu.in',
  phone: '+91 97172 09328',
  gender: 'Male',
  role: 'Mediator',
  domains: ['Full Stack', 'Cloud Computing', 'AI/ML'],
  connectedClubs: ['Google Developer Groups (GDG)', 'Open Source Software (OSS)', 'Entrepreneurship Cell (E-Cell)'],
  avatar: '/clubprofiles/aps.png',
  bannerText: 'Unstoppable!!',
  bio: 'Full Stack Developer | Go | Web3 | Blockchain | IEEE Student Member | Army Institute of technology',
  clubs: [
    {
      id: 'c1',
      name: 'Google Developer Groups (GDG)',
      role: 'Joint Secretary',
      logo: '/clublogos/google-developers.svg',
      description: 'To create a strong community of student developers and connect them across the globe.',
      whatsapp: 'https://chat.whatsapp.com/gdg',
      telegram: 'https://t.me/gdg'
    },
    {
      id: 'c2',
      name: 'Open Source Software (OSS)',
      role: '.../',
      logo: '/clublogos/oss.svg',
      description: 'An open-source organization aiming to promote open source culture in India and spread knowledge nationwide.',
      whatsapp: 'https://chat.whatsapp.com/oss',
      telegram: 'https://t.me/oss'
    },
  ]
};

export const membersData = [
  { id: 'm1', clubId: 'c1', name: 'Peush Yadav', email: 'peushyadav_240702@aitpune.edu.in', role: 'SE', domain: 'MERN Stack', status: 'Active', avatar: '' },
  { id: 'm2', clubId: 'c1, c2', name: 'APS_X', email: 'aryanpratapsingh_240114@aitpune.edu.in', role: 'SE', domain: 'Full Stack', status: 'Active', avatar: '' },
  { id: 'm3', clubId: 'c1, c2', name: 'Jitesh Yadav', email: 'jiteshyadav_250097@aitpune.edu.in', role: 'FE', domain: 'Frontend', status: 'Active', avatar: '' },
  { id: 'm4', clubId: 'c1, c3', name: 'Vishal Goswami', email: 'vishalgoswami_250224@aitpune.edu.in', role: 'FE', domain: 'Backend', status: 'Active', avatar: '' },
  { id: 'm5', clubId: 'c1', name: 'Sajal Rawat', email: 'sajalrawat_250309@aitpune.edu.in', role: 'FE', domain: 'Design', status: 'Active', avatar: '' },
  { id: 'm6', clubId: 'c2', name: 'Harshwardhan', email: 'harshwardhan_250452@aitpune.edu.in', role: 'FE', domain: 'Design', status: 'Active', avatar: '' },
];

export const tasksData = [
  { id: 't1', clubId: 'c1', title: 'Update Landing Page', description: 'Use react libraries and animate the hero page.', assignedTo: 'm1', assignedToName: 'Peush Yadav', status: 'In Progress', priority: 'High', deadline: '2026-02-22', createdAt: '2026-02-01' },
  { id: 't2', clubId: 'c2', title: 'Fix Authentication', description: 'Resolve the oauth issue.', assignedTo: 'm2', assignedToName: 'APS_X', status: 'Pending', priority: 'High', deadline: '2026-02-22', createdAt: '2026-02-01' },
  { id: 't3', clubId: 'c3', title: 'Design System Documentation', description: 'Document all reusable UI components.', assignedTo: 'm4', assignedToName: 'Sajal Rawat', status: 'Completed', priority: 'Medium', deadline: '2026-02-22', createdAt: '2026-02-01' },
  { id: 't4', clubId: 'c1', title: 'fix image drag', description: 'Make the images undraggable.', assignedTo: 'm4', assignedToName: 'Jitesh Yadav', status: 'Pending', priority: 'Low', deadline: '2026-02-22', createdAt: '2026-02-01' },
];

export const messagesData = [
  { id: 'msg1', clubId: 'c1', senderId: 'm1', senderName: 'Peush Yadav', receiverId: null, content: 'Hey everyone, our website is live on https://sync-ait.vercel.app', timestamp: '2026-02-01T10:30:00Z', avatar: '' },
  { id: 'msg2', clubId: 'c1', senderId: 'te-1', senderName: 'Nishant Singh', receiverId: null, content: 'Great work Sajal! I will review them shortly.', timestamp: '2026-02-01T10:35:00Z', avatar: 'https://github.com/shadcn.png' },
  { id: 'msg3', clubId: 'c2', senderId: 'm2', senderName: 'APS_X', receiverId: null, content: 'Do we have a meeting today?', timestamp: '2026-02-01T11:00:00Z', avatar: '' },
  { id: 'msg4', clubId: 'c3', senderId: 'm1', senderName: 'Peush Yadav', receiverId: 'te-1', content: 'Can we discuss the hero animation logic?', timestamp: '2026-02-01T14:20:00Z', avatar: '' },
];

export const notificationsData = [
  { id: 'n1', title: 'Task Deadline', message: 'Task "Fix API Authentication" is due in 2 days.', type: 'alert', isRead: false, timestamp: '2026-02-01T09:00:00Z' },
  { id: 'n2', title: 'New Message', message: 'Sajal Rawat sent a message in Public Channel.', type: 'info', isRead: false, timestamp: '2026-02-01T10:30:00Z' },
  { id: 'n3', title: 'Member Added', message: 'New member Vishal Goswami joined the team.', type: 'success', isRead: true, timestamp: '2026-02-01T15:00:00Z' },
];
