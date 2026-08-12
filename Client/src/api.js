const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const DEMO_ITEMS = [
  { _id: 'demo-1', type: 'lost', title: 'Silver Water Bottle', description: 'A stainless steel bottle with a blue sticker on the lid and a small scratch near the base.', category: 'Accessories', location: 'Library', date: '2026-08-08', photoUrl: '', claimQuestion: 'What color sticker was on the lid?', tags: ['bottle', 'silver', 'water'], status: 'active', postedBy: { _id: 'demo-user-1', name: 'Emma', email: 'emma@campus.edu' } },
  { _id: 'demo-2', type: 'found', title: 'Student ID Card', description: 'Found near the student center. It has a blue campus logo and a slightly bent corner.', category: 'ID & Cards', location: 'Student Center', date: '2026-08-07', photoUrl: '', claimQuestion: 'What is the student ID number printed on the front?', tags: ['id', 'card', 'campus'], status: 'active', postedBy: { _id: 'demo-user-2', name: 'Noah', email: 'noah@campus.edu' } },
  { _id: 'demo-3', type: 'lost', title: 'Black Keychain', description: 'Small black keychain with a tiny red heart charm and a metal loop.', category: 'Keys', location: 'Main Building', date: '2026-08-06', photoUrl: '', claimQuestion: 'What charm is attached to the keychain?', tags: ['keys', 'black', 'keychain'], status: 'active', postedBy: { _id: 'demo-user-3', name: 'Maya', email: 'maya@campus.edu' } },
  { _id: 'demo-4', type: 'found', title: 'Blue Backpack', description: 'A medium blue backpack with a zipper pull and a small campus sticker on the front pocket.', category: 'Bags', location: 'Cafeteria', date: '2026-08-04', photoUrl: '', claimQuestion: 'What sticker is on the front pocket of the bag?', tags: ['bag', 'blue', 'backpack'], status: 'active', postedBy: { _id: 'demo-user-4', name: 'Liam', email: 'liam@campus.edu' } },
  { _id: 'demo-5', type: 'lost', title: 'Wireless Earbuds', description: 'Black wireless earbuds in a charging case with a white logo on the case.', category: 'Electronics', location: 'Sports Complex', date: '2026-08-03', photoUrl: '', claimQuestion: 'What color is the charging case logo?', tags: ['earbuds', 'audio', 'tech'], status: 'active', postedBy: { _id: 'demo-user-5', name: 'Zoe', email: 'zoe@campus.edu' } },
  { _id: 'demo-6', type: 'found', title: 'Math Textbook', description: 'A blue hardcover math textbook with a folded page corner and a pen mark inside.', category: 'Books', location: 'Library', date: '2026-08-02', photoUrl: '', claimQuestion: 'Which course code is written on the first page?', tags: ['textbook', 'math', 'book'], status: 'active', postedBy: { _id: 'demo-user-6', name: 'Ava', email: 'ava@campus.edu' } },
  { _id: 'demo-7', type: 'lost', title: 'Red Hoodie', description: 'Red hoodie with a small cream logo stitched on the left sleeve.', category: 'Clothing', location: 'Parking Area', date: '2026-08-01', photoUrl: '', claimQuestion: 'What logo is on the left sleeve?', tags: ['hoodie', 'red', 'clothes'], status: 'active', postedBy: { _id: 'demo-user-7', name: 'Sophia', email: 'sophia@campus.edu' } },
  { _id: 'demo-8', type: 'found', title: 'USB Drive', description: 'Small silver USB drive with a blue label and a campus logo sticker.', category: 'Electronics', location: 'Main Building', date: '2026-07-30', photoUrl: '', claimQuestion: 'What text is printed on the blue label?', tags: ['usb', 'drive', 'tech'], status: 'active', postedBy: { _id: 'demo-user-8', name: 'Leo', email: 'leo@campus.edu' } },
  { _id: 'demo-9', type: 'lost', title: 'Grey Wallet', description: 'Thin grey wallet with a faded campus lanyard clip still attached.', category: 'Accessories', location: 'Student Center', date: '2026-07-29', photoUrl: '', claimQuestion: 'What color is the attached lanyard clip?', tags: ['wallet', 'grey', 'accessory'], status: 'active', postedBy: { _id: 'demo-user-9', name: 'Ivy', email: 'ivy@campus.edu' } },
  { _id: 'demo-10', type: 'found', title: 'Glasses Case', description: 'Black glasses case with a thin silver clasp and a few small scratches on the corner.', category: 'Accessories', location: 'Library', date: '2026-07-28', photoUrl: '', claimQuestion: 'What color is the clasp on the case?', tags: ['glasses', 'black', 'case'], status: 'active', postedBy: { _id: 'demo-user-10', name: 'Daniel', email: 'daniel@campus.edu' } }
]

export function getDemoItems(params = {}) {
  const { type, category, location, status } = params
  return DEMO_ITEMS.filter(item => {
    if (type && item.type !== type) return false
    if (category && item.category !== category) return false
    if (location && item.location !== location) return false
    if (status && item.status !== status) return false
    return true
  })
}

export async function request(path, options = {}) {
  const token = localStorage.getItem('findit_token')

  try {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.')
    return payload
  } catch (error) {
    if (path.startsWith('/items/')) {
      const id = path.split('/items/')[1]
      const item = DEMO_ITEMS.find(candidate => candidate._id === id || candidate._id === `demo-${id}`)
      if (item) return { success: true, data: item }
    }
    if (path.startsWith('/items')) {
      return { success: true, count: getDemoItems({}).length, data: getDemoItems({}) }
    }
    throw error
  }
}

export const getItems = async (params = {}) => {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString()
  try {
    return await request(`/items${query ? `?${query}` : ''}`)
  } catch (error) {
    return { success: true, count: getDemoItems(params).length, data: getDemoItems(params) }
  }
}
