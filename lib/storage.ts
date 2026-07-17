export function productImagePath(fileName: string) {
  return `/uploads/products/${fileName}`;
}

export function categoryImagePath(fileName: string) {
  return `/uploads/categories/${fileName}`;
}

export function blogImagePath(fileName: string) {
  return `/uploads/blog/${fileName}`;
}

export function avatarPath(fileName: string) {
  return `/uploads/users/${fileName}`;
}