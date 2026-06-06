// Laddar automatiskt ALLA rum-JSON-filer i ./rooms och sorterar på `order`.
// Vill du lägga till ett nytt rum? Skapa bara en ny JSON-fil i ./rooms –
// ingen kod behöver ändras.

const modules = import.meta.glob("./rooms/*.json", { eager: true });

export const ROOMS = Object.values(modules)
  .map((m) => m.default || m)
  .sort((a, b) => a.order - b.order);

export const ROOM_COUNT = ROOMS.length;

export function getRoomById(id) {
  return ROOMS.find((r) => r.id === id) || null;
}

export function getRoomByOrder(order) {
  return ROOMS.find((r) => r.order === order) || null;
}
