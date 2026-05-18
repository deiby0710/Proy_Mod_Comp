import { Patient } from '../../patients/models/patient';

export interface DeliveryItem {
  id?: number;
  product?: number;
  product_id?: number;
  product_name: string;
  generic_name: string;
  price: number;
  pharmaceutic_form: string;
  final_date: string;
  cum: string;
  prescribed_quantity: number;
  dispensed_quantity: number;
}

export interface Delivery {
  id?: number;
  registration_date: string;
  patient: number;
  patient_detail?: Patient;
  note?: string;
  items: DeliveryItem[];
  created_at?: string;
}
