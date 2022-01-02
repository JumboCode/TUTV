import { EquipmentItem } from './Equipment';

export interface EquipmentRequest {
  id: number;
  timestamp: string;
  project: string;
  request_out: string;
  request_in: string;
  actual_out: string | null;
  actual_in: string | null;
  status: 'Requested' | 'Confirmed' | 'Checked Out' | 'Returned' | 'Cancelled';
  user: number;
  approving_board_member: number | null;
  equipment_items: EquipmentItemWithQty[];
}

export interface EquipmentItemWithQty {
  item_id: number;
  item: EquipmentItem;
  quantity: number;
}
