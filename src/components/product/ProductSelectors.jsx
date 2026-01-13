const ProductSelectors = ({ 
    sizes, 
    colors, 
    selectedSize, 
    setSelectedSize, 
    selectedColor, 
    setSelectedColor 
}) => {
  return (
    <div className="space-y-6 pt-6 border-t border-gray-100">
      {sizes && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Select Size
          </h3>
          <div className="flex flex-wrap gap-3">
            {sizes.map((sizeObj) => (
              <button
                key={sizeObj.size}
                onClick={() => setSelectedSize(sizeObj.size)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center font-medium transition-all ${
                  selectedSize === sizeObj.size
                    ? "border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-600 ring-offset-2"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                {sizeObj.size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Select Color
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.colorName}
                onClick={() => setSelectedColor(color.colorName)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  selectedColor === color.colorName
                    ? "ring-2 ring-blue-600 ring-offset-2"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.colorName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductSelectors;
