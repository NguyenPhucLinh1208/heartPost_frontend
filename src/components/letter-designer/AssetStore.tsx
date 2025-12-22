import React, { useState } from 'react';
import { X, Package, FileText, Image as ImageIcon, Check, LucideIcon } from 'lucide-react';
import { ASSETS } from './assets';

// 1. Định nghĩa kiểu dữ liệu cho Vật phẩm (Asset)
export interface AssetItem {
  id: string;
  name: string;
  thumb: string;
  color: string;
}

// 2. Định nghĩa Props cho Component chính
interface AssetStoreProps {
  isOpen: boolean;
  onClose: () => void;
  // Hàm onSelect nhận vào loại (type) và vật phẩm (item)
  onSelect: (type: 'envelope' | 'paper' | 'background', item: AssetItem) => void;
}

// 3. Định nghĩa Props cho nút Tab con
interface TabButtonProps {
  id: 'envelope' | 'paper' | 'background';
  label: string;
  icon: LucideIcon; // Kiểu dữ liệu chuẩn cho Icon từ thư viện lucide-react
}

export const AssetStore: React.FC<AssetStoreProps> = ({ isOpen, onClose, onSelect }) => {
  // State cũng cần định nghĩa kiểu union type
  const [activeTab, setActiveTab] = useState<'envelope' | 'paper' | 'background'>('envelope');

  if (!isOpen) return null;

  // TypeScript sẽ tự hiểu currentItems là AssetItem[] nhờ vào file assets.js (nếu file đó chuẩn)
  // Hoặc ta ép kiểu tường minh để an toàn
  let currentItems: AssetItem[] = [];
  if (activeTab === 'envelope') currentItems = ASSETS.envelopes;
  else if (activeTab === 'paper') currentItems = ASSETS.papers;
  else currentItems = ASSETS.backgrounds;

  // Component con: Nút Tab (Đã thêm Type)
  const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-black font-bold text-sm transition-all
        ${activeTab === id 
          ? 'bg-[#FF6B6B] text-white shadow-[2px_2px_0px_0px_#1C1C1C] translate-y-[-1px]' 
          : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-black'}
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      <div className="w-full max-w-4xl h-[85vh] bg-[#F4F1EA] border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_#1C1C1C] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 bg-white border-b-2 border-black">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1C1C]">
              Cửa hàng
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Chọn nguyên liệu cho lá thư của bạn
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-full hover:bg-red-50 hover:text-red-500 hover:rotate-90 transition-all shadow-[2px_2px_0px_0px_#1C1C1C] active:shadow-none active:translate-y-0.5"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-3 p-6 pb-2 overflow-x-auto bg-[#F4F1EA]">
          <TabButton id="envelope" label="Phong Bì" icon={Package} />
          <TabButton id="paper" label="Giấy Thư" icon={FileText} />
          <TabButton id="background" label="Phông Nền" icon={ImageIcon} />
        </div>

        {/* GRID ITEMS */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
            {currentItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => {
                  onSelect(activeTab, item);
                  onClose();
                }}
                className="group relative bg-white border-2 border-black rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[5px_5px_0px_0px_#1C1C1C] hover:-translate-y-1 transition-all duration-200"
              >
                {/* Image Area */}
                <div className="aspect-square w-full border-b-2 border-black relative overflow-hidden bg-gray-100">
                  <img 
                    src={item.thumb} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_#1C1C1C] flex items-center gap-1">
                        <Check size={12} strokeWidth={4} /> CHỌN
                     </div>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-3 text-center bg-white group-hover:bg-[#FFF5F5] transition-colors">
                  <div className="text-sm font-bold text-gray-800 truncate px-1">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#1C1C1C] text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Mẹo: Bạn có thể tải ảnh riêng trong phần thiết kế
            </p>
        </div>

      </div>
    </div>
  );
};