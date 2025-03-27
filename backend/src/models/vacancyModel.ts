import mongoose, { Schema, Document } from 'mongoose';

export type Client = 'GlobalBit' | 'Acterys' | 'SQLDBM' | 'Andersen';

export interface IVacancy extends Document {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRangeMin: number;
  salaryRangeMax: number;
  currency: string;
  location: string;
  employmentType: string;
  status: 'active' | 'closed';
  department: string;
  level: string;
  tags: string[];
  benefits: string[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  client: Client;
  createdAt: Date;
  updatedAt: Date;
}

const vacancySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  responsibilities: [{ type: String }],
  salaryRangeMin: { type: Number, required: true },
  salaryRangeMax: { type: Number, required: true },
  currency: { type: String, default: 'RUB' },
  location: { type: String, default: 'Москва' },
  employmentType: { type: String, default: 'Полная занятость' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  department: { type: String },
  level: { type: String },
  tags: [{ type: String }],
  benefits: [{ type: String }],
  contactPerson: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  client: { 
    type: String, 
    enum: ['GlobalBit', 'Acterys', 'SQLDBM', 'Andersen'],
    default: 'GlobalBit'
  }
}, {
  timestamps: true
});

export const VacancyModel = mongoose.model<IVacancy>('Vacancy', vacancySchema); 