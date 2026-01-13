const ProductGallery = ({ image, name }) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>
    </div>
  );
};
export default ProductGallery;
