import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDynamicMenu } from '../hooks/useDynamicMenu';

const MAX_IMAGE_BYTES = 500 * 1024; // 500KB warning threshold

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminCakeManager() {
  const { allCakes, addCake, deleteCake, updateCake } = useDynamicMenu();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [preview, setPreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [imageWarning, setImageWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_BYTES) {
      setImageWarning(`Image is ${(file.size / 1024).toFixed(0)}KB. Large images may slow down the page. Recommend < 500KB.`);
    } else {
      setImageWarning('');
    }

    const b64 = await fileToBase64(file);
    setImageData(b64);
    setPreview(b64);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const cake = {
      name: data.name,
      description: data.description,
      price: `₹${data.price}`,
      priceRaw: parseFloat(data.price),
      category: data.category || 'Custom',
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
      image: imageData || '/images/placeholder_cake.webp',
    };

    if (editingId) {
      updateCake(editingId, cake);
      setEditingId(null);
    } else {
      addCake(cake);
    }

    reset();
    setPreview(null);
    setImageData(null);
    setIsSubmitting(false);
  };

  const handleEdit = (cake) => {
    setEditingId(cake.id);
    setPreview(cake.image);
    setImageData(cake.image);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-display text-3xl md:text-4xl text-plum">Cake Manager</h1>
        <p className="font-sans text-sm text-plum/50 mt-2">
          Add new cakes or edit existing ones. Static seed cakes cannot be deleted.
        </p>
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-mist border border-border/30 p-8 mb-12"
      >
        <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-plum/60 mb-8">
          {editingId ? 'Edit Cake' : 'Add New Cake'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image Upload */}
          <div className="flex flex-col gap-3">
            <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
              Cake Image
            </label>
            <div
              className="relative w-full aspect-square border-2 border-dashed border-plum/20 flex items-center justify-center cursor-pointer hover:border-gold/60 transition-colors overflow-hidden bg-pearl"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-plum/30">
                  <span className="text-4xl">+</span>
                  <span className="font-sans text-xs">Click to upload image</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {imageWarning && (
              <p className="text-xs font-sans text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2">
                ⚠ {imageWarning}
              </p>
            )}
          </div>

          {/* Right: Fields */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                Cake Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Blueberry Dream Cake"
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={3}
                className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="A short, enticing description…"
              />
              {errors.description && (
                <span className="text-xs text-red-500">{errors.description.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('price', { required: 'Price required' })}
                  className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                  placeholder="650"
                />
                {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                >
                  <option>Signature</option>
                  <option>Celebration</option>
                  <option>Fresh</option>
                  <option>Classic</option>
                  <option>Wedding</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-xs uppercase tracking-widest text-plum/60">
                Tags (comma separated)
              </label>
              <input
                {...register('tags')}
                className="border border-plum/20 bg-pearl px-4 py-2.5 font-sans text-sm text-plum focus:outline-none focus:border-gold transition-colors"
                placeholder="e.g. Fruity, Light, Custom"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-plum text-pearl font-sans text-sm uppercase tracking-widest hover:bg-plum/80 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving…' : editingId ? 'Update Cake' : 'Add to Menu'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); reset(); setPreview(null); }}
              className="px-8 py-3 border border-plum/30 text-plum font-sans text-sm uppercase tracking-widest hover:border-plum transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Cake List */}
      <div>
        <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-plum/60 mb-6">
          All Cakes ({allCakes.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCakes.map((cake) => (
            <div key={cake.id} className="border border-border/50 bg-pearl group">
              <div className="aspect-[4/3] overflow-hidden bg-mist">
                <img
                  src={cake.image}
                  alt={cake.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { e.target.src = '/images/placeholder_cake.webp'; }}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-display text-base text-plum">{cake.name}</h3>
                  <span className="font-sans font-semibold text-sm text-plum shrink-0">
                    {cake.price}
                  </span>
                </div>
                <p className="font-sans text-xs text-plum/60 mb-4 line-clamp-2">
                  {cake.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                    cake.isAdminAdded
                      ? 'bg-gold/20 text-plum border border-gold/30'
                      : 'bg-mist text-plum/40 border border-mist'
                  }`}>
                    {cake.isAdminAdded ? 'Admin Added' : 'Seed'}
                  </span>
                  {cake.isAdminAdded && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(cake)}
                        className="font-sans text-xs text-plum/50 hover:text-plum transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCake(cake.id)}
                        className="font-sans text-xs text-dusty-rose hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
