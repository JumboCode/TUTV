export default interface Item {
  name: string;
  slug: string;
  category: {
    name: string;
    slug: string;
    id: number;
  };
  total_count: number;
  image: string | null;
}
