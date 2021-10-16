export interface EquipmentCategory {
  id: number;
  name: string;
  description: string;
  types?: EquipmentType[];
}

export interface EquipmentType {
  id: number;
  name: string;
  description: string;
  equipment_category_FK?: number;
  items?: EquipmentItem[];
}

export interface EquipmentItem {
  id: number;
  name: string;
  description: string;
  image: string;
  product_url: string;
  equipment_type_FK?: number;
  num_instances?: number;
}
