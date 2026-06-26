export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  weight: number | null;
  unit: string;
  imageUrl: string | null;
  certification: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileContent {
  id: string;
  groupName: string;
  tagline: string | null;
  history: string;
  vision: string;
  missions: string[];
  address: string;
  whatsapp: string;
  foundedDate: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  section: string | null;
  displayOrder: number;
  isManagement: boolean;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  unit?: string;
}
