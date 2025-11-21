import React from 'react';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
}

export interface NavLink {
  name: string;
  url: string;
  external?: boolean;
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface Song {
  title: string;
  url: string;
}