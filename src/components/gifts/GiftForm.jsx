import React, { useState, useEffect } from 'react';
import '../styles/GiftForm.css';

export default function GiftForm({ gift, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    pointCost: '',
    quantityAvailable: '',
    validFrom: '',
    validUntil: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (gift) {
      setFormData({
        name: gift.name,
        description: gift.description || '',
        imageUrl: gift.imageUrl || '',
        pointCost: gift.pointCost,
        quantityAvailable: gift.quantityAvailable || '',
        validFrom: gift.validFrom.split('T')[0],
        validUntil: gift.validUntil.split('T')[0],
      });
    }
  }, [gift]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Gift name is required';
    }

    if (!formData.pointCost || Number(formData.pointCost) <= 0) {
      newErrors.pointCost = 'Point cost must be greater than 0';
    }

    if (!formData.validFrom) {
      newErrors.validFrom = 'Valid from date is required';
    }

    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required';
    }

    if (formData.validFrom && formData.validUntil) {
      const from = new Date(formData.validFrom);
      const until = new Date(formData.validUntil);
      if (until <= from) {
        newErrors.validUntil = 'Valid until must be after valid from';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="gift-form-overlay">
      <div className="gift-form-modal">
        <h2>{gift ? 'Edit Gift' : 'Create New Gift'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Gift Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Coffee Card"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description for customers"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/gift.jpg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pointCost">Point Cost *</label>
              <input
                type="number"
                id="pointCost"
                name="pointCost"
                value={formData.pointCost}
                onChange={handleChange}
                placeholder="1000"
                min="1"
                className={errors.pointCost ? 'error' : ''}
              />
              {errors.pointCost && <span className="error-text">{errors.pointCost}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantityAvailable">Quantity Available</label>
              <input
                type="number"
                id="quantityAvailable"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="validFrom">Valid From *</label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className={errors.validFrom ? 'error' : ''}
              />
              {errors.validFrom && <span className="error-text">{errors.validFrom}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="validUntil">Valid Until *</label>
              <input
                type="date"
                id="validUntil"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                className={errors.validUntil ? 'error' : ''}
              />
              {errors.validUntil && <span className="error-text">{errors.validUntil}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {gift ? 'Update Gift' : 'Create Gift'}
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
