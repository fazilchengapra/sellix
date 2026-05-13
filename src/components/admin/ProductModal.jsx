import { useState, useEffect } from "react";
import { X, ImagePlus, Trash2, Plus, Loader2 } from "lucide-react";

const ProductModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discount: "0",
    description: "",
  });

  const [colors, setColors] = useState([
    {
      color_name: "",
      hex: "#000000",
      existingImages: [],
      newFiles: [],
      newPreviews: []
    }
  ]);

  const [dragActiveId, setDragActiveId] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || "",
        discount: product.discount || "0",
        description: product.description || "",
      });
      
      if (product.colors && product.colors.length > 0) {
        const loadedColors = product.colors.map((color, idx) => ({
          color_id: color.id,
          color_name: color.color_name || "",
          hex: color.hex || "#000000",
          existingImages: color.images?.map((img) => img.image || img) || [],
          newFiles: [],
          newPreviews: []
        }));
        setColors(loadedColors);
      } else {
        setColors([{
          id: Date.now().toString(),
          color_name: "",
          hex: "#000000",
          existingImages: [],
          newFiles: [],
          newPreviews: []
        }]);
      }
    } else {
      setFormData({ name: "", brand: "", category: "", price: "", discount: "0", description: "" });
      setColors([{
        id: Date.now().toString(),
        color_name: "",
        hex: "#000000",
        existingImages: [],
        newFiles: [],
        newPreviews: []
      }]);
    }
    setDragActiveId(null);
  }, [product, isOpen]);

  const handleFiles = (colorIndex, files) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setColors((prev) => {
      const newColors = [...prev];
      const color = { ...newColors[colorIndex] };
      color.newFiles = [...(color.newFiles || []), ...imageFiles];
      
      const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
      color.newPreviews = [...(color.newPreviews || []), ...newPreviews];
      
      newColors[colorIndex] = color;
      return newColors;
    });
  };

  const handleDrag = (e, colorId) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActiveId(colorId);
    else if (e.type === "dragleave") setDragActiveId(null);
  };

  const handleDrop = (e, colorIndex, colorId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);
    if (e.dataTransfer.files?.length > 0) handleFiles(colorIndex, e.dataTransfer.files);
  };

  const addColor = () => {
    setColors(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      color_name: "",
      hex: "#000000",
      existingImages: [],
      newFiles: [],
      newPreviews: []
    }]);
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index, field, value) => {
    setColors(prev => {
      const newColors = [...prev];
      newColors[index] = { ...newColors[index], [field]: value };
      return newColors;
    });
  };

  const removeNewImage = (colorIndex, imageIndex) => {
    setColors(prev => {
      const newColors = [...prev];
      const color = { ...newColors[colorIndex] };
      color.newFiles = color.newFiles.filter((_, i) => i !== imageIndex);
      
      if (color.newPreviews[imageIndex]) {
        URL.revokeObjectURL(color.newPreviews[imageIndex]);
      }
      color.newPreviews = color.newPreviews.filter((_, i) => i !== imageIndex);
      
      newColors[colorIndex] = color;
      return newColors;
    });
  };

  const removeExistingImage = (colorIndex, imageIndex) => {
    setColors(prev => {
      const newColors = [...prev];
      const color = { ...newColors[colorIndex] };
      color.existingImages = color.existingImages.filter((_, i) => i !== imageIndex);
      newColors[colorIndex] = color;
      return newColors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("brand", formData.brand);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("discount", formData.discount || 0);
    data.append("description", formData.description);

    const colorsMeta = colors.map((color, index) => {
      color.newFiles.forEach((file) => {
        data.append(`color_${index}_images`, file);
      });
      return {
        id: color.color_id || null,
        color_name: color.color_name,
        hex: color.hex,
        existing_images: color.existingImages
      };
    });

    data.append("colors", JSON.stringify(colorsMeta));

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  placeholder="Nike Air Max"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  required
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  placeholder="Nike"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                >
                  <option value="">Select Category</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="casual">Casual</option>
                  <option value="sports">Sports</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  placeholder="2999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none h-32 resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Colors & Images</h3>
              <button
                type="button"
                onClick={addColor}
                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium flex items-center gap-1 transition-colors"
              >
                <Plus size={16} /> Add Color
              </button>
            </div>

            <div className="space-y-6">
              {colors.map((color, colorIndex) => {
                const totalImages = color.existingImages.length + color.newPreviews.length;
                
                return (
                  <div key={color.id} className="border border-gray-200 rounded-xl p-5 relative bg-gray-50/50">
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(colorIndex)}
                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                        title="Remove Color"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pr-10">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
                        <input
                          required
                          type="text"
                          value={color.color_name}
                          onChange={(e) => updateColor(colorIndex, 'color_name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                          placeholder="e.g. Midnight Black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Code</label>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <input
                              type="color"
                              value={color.hex}
                              onChange={(e) => updateColor(colorIndex, 'hex', e.target.value)}
                              className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 absolute opacity-0"
                            />
                            <div 
                              className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm pointer-events-none" 
                              style={{ backgroundColor: color.hex }}
                            />
                          </div>
                          <input
                            required
                            type="text"
                            value={color.hex}
                            onChange={(e) => updateColor(colorIndex, 'hex', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white uppercase font-mono text-sm"
                            pattern="^#[0-9A-Fa-f]{6}$"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images for {color.color_name || 'this color'} {totalImages > 0 && <span className="text-gray-400 font-normal">({totalImages})</span>}
                      </label>

                      <label
                        className={`relative block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          dragActiveId === color.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-white bg-gray-50"
                        }`}
                        onDragEnter={(e) => handleDrag(e, color.id)}
                        onDragOver={(e) => handleDrag(e, color.id)}
                        onDragLeave={(e) => handleDrag(e, null)}
                        onDrop={(e) => handleDrop(e, colorIndex, color.id)}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            handleFiles(colorIndex, e.target.files);
                            e.target.value = "";
                          }}
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <ImagePlus size={20} className="text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            Drop images here or <span className="text-blue-600">browse</span>
                          </p>
                        </div>
                      </label>

                      {totalImages > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                          {color.existingImages.map((url, i) => (
                            <div
                              key={`existing-${i}`}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white"
                            >
                              <img src={url} alt={`Color ${colorIndex} - ${i + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); removeExistingImage(colorIndex, i); }}
                                  className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}

                          {color.newPreviews.map((preview, i) => (
                            <div
                              key={`new-${i}`}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-blue-200 bg-white"
                            >
                              <img src={preview} alt={`New ${colorIndex} - ${i + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); removeNewImage(colorIndex, i); }}
                                  className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="absolute top-1 left-1 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">
                                NEW
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white pb-2 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

