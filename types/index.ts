export interface User {
  id: string
  name: string
  email: string
  role: 'MEMBER' | 'ADMIN'
  phone?: string
  address?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  date: Date
  time: string
  location: string
  image?: string
  isUpcoming: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  author: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  image?: string
  isActive: boolean
  createdAt: Date
}

export interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  size?: string
  isMemberOnly: boolean
  createdAt: Date
}

export interface PrayerRequest {
  id: string
  userId?: string
  name: string
  email: string
  request: string
  isAnonymous: boolean
  status: 'PENDING' | 'PRAYED' | 'ANSWERED'
  createdAt: Date
}

export interface VolunteerSignup {
  id: string
  userId?: string
  name: string
  email: string
  phone: string
  interest: string
  message?: string
  status: 'PENDING' | 'CONTACTED' | 'APPROVED'
  createdAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  isActive: boolean
  createdAt: Date
}