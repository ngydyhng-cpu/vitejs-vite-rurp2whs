import './style.css';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://tjfjzmyedgwkanbifots.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_xnFTCE0EbcW7RcqTjwwDuQ_d9PZK2lP';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let allRooms = [];
let currentPriceFilter = 'all';
let currentPeopleFilter = 'all';
let activeImageIndices = {};

window.changeRoomImage = function(roomId, index) {
  activeImageIndices[roomId] = index;
  renderApp(getFilteredRooms());
};

async function loadRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    document.querySelector('#app').innerHTML = `
      <div style="max-width: 600px; margin: 50px auto; padding: 25px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: 12px; color: #b91c1c; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
        <h2 style="margin-top: 0; font-size: 20px;">Lỗi kết nối Supabase</h2>
        <p style="margin-bottom: 0;">${error.message}</p>
      </div>
    `;
    return;
  }

  allRooms = data || [];
  renderApp(allRooms);
}

function getFilteredRooms() {
  const priceValue = currentPriceFilter;
  const peopleValue = currentPeopleFilter;

  return allRooms.filter((room) => {
    let matchPrice = true;
    if (priceValue !== 'all') {
      const [min, max] = priceValue.split('-').map(Number);
      const roomPrice = room.gia_phong || 0;
      matchPrice = roomPrice >= min && roomPrice <= max;
    }

    let matchPeople = true;
    if (peopleValue !== 'all') {
      const roomPeopleStr = String(room.so_nguoi || '').trim();
      matchPeople = roomPeopleStr.includes(peopleValue);
    }

    return matchPrice && matchPeople;
  });
}

function renderApp(roomsToDisplay) {
  const appContainer = document.querySelector('#app');

  appContainer.innerHTML = `
    <div style="font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; min-height: 100vh; padding: 30px 15px; color: #1e293b;">
      
      <!-- Header -->
      <header style="max-width: 900px; margin: 0 auto 20px auto; background: #ffffff; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(30, 58, 138, 0.05), 0 8px 10px -6px rgba(30, 58, 138, 0.05); border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(to bottom, #2563eb, #3b82f6);"></div>
        
        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 95px; height: 95px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.06));" />
          
          <div style="flex-grow: 1;">
            <h1 style="color: #1e3a8a; font-size: 40px; margin: 0 0 6px 0; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1;">FindRoom</h1>
            <div style="font-size: 15px; color: #475569; font-weight: 600; line-height: 1.4;">Đối tượng: Sinh viên năm 1 - trường Đại học Khoa học - Đại học Thái Nguyên</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📍 Địa chỉ:</span> <span style="font-weight: 500; color: #64748b;">Phan Đình Phùng - Thái Nguyên</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📞 SĐT:</span> <span style="font-weight: 500; color: #64748b;">0123456789</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: #eff6ff; padding: 8px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; border: 1px solid #bfdbfe; color: #1d4ed8;">
            <span>✨</span> <span>Nhóm 5</span>
          </div>
        </div>

      </header>

      <!-- Slogan -->
      <div style="max-width: 900px; margin: 0 auto 25px auto;">
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 22px 28px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); position: relative;">
          <span style="position: absolute; top: 10px; left: 16px; font-size: 40px; color: #cbd5e1; font-family: serif; line-height: 1;">“</span>
          <p style="color: #334155; font-size: 16px; line-height: 1.7; font-style: italic; font-weight: 500; text-align: center; margin: 0; position: relative; z-index: 1;">
            "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý. Mình mong muốn giúp các bạn, đặc biệt là sinh viên năm nhất trường Đại học Khoa học - Thái Nguyên, dễ dàng tìm kiếm và lựa chọn chỗ ở có giá cả và dịch vụ phù hợp với nhu cầu, tránh mất nhiều thời gian và gặp khó khăn khi tìm trọ."
          </p>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div style="max-width: 900px; margin: 0 auto 25px auto; background: #ffffff; padding: 22px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.03); display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; border: 1px solid #e2e8f0; border-top: 4px solid #2563eb;">
        
        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">💰 Khoảng giá phòng</label>
          <select id="filter-price" style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; background: #fff; outline: none; cursor: pointer; transition: all 0.2s;">
            <option value="all">Tất cả mức giá</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-2000000">1 triệu - 2 triệu</option>
            <option value="2000000-3000000">2 triệu - 3 triệu</option>
            <option value="3000000-4000000">3 triệu - 4 triệu</option>
            <option value="4000000-5000000">4 triệu - 5 triệu</option>
            <option value="5000000-999999999">Trên 5 triệu</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 13px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">👥 Số lượng người ở</label>
          <select id="filter-people" style="width: 100%; padding: 11px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; background: #fff; outline: none; cursor: pointer; transition: all 0.2s;">
            <option value="all">Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>

      </div>

      <!-- Main Container -->
      <main style="max-width: 900px; margin: 0 auto;">
        <h2 style="font-size: 18px; color: #1e3a8a; margin-bottom: 20px; border-left: 4px solid #2563eb; padding-left: 12px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
          <span>Danh sách phòng trọ</span>
          <span style="font-size: 13px; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 20px; font-weight: 600;">${roomsToDisplay.length} kết quả</span>
        </h2>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #fff; padding: 50px; text-align: center; border-radius: 16px; color: #64748b; border: 1px solid #e2e8f0; font-weight: 500;">Không tìm thấy phòng trọ phù hợp với bộ lọc.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml =
                    '<div style="width: 100%; height: 260px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: #94a3b8; font-size: 14px; font-weight: 500;">Chưa có ảnh</div>';

                  if (room.hinh_anh) {
                    const imgUrls = room.hinh_anh
                      .split(',')
                      .map((url) => url.trim())
                      .filter((url) => url);
                    
                    if (imgUrls.length > 0) {
                      let activeIdx = activeImageIndices[room.id] || 0;
                      if (activeIdx >= imgUrls.length) activeIdx = 0;

                      imagesHtml = `
                        <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                          <div style="width: 100%; height: 260px; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); position: relative;">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng trọ chính" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" />
                          </div>
                          
                          ${
                            imgUrls.length > 1
                              ? `
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%;">
                              ${imgUrls
                                .map(
                                  (url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 60px; height: 60px; border-radius: 8px; border: ${idx === activeIdx ? '2px solid #2563eb' : '1px solid #cbd5e1'}; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #fff; opacity: ${idx === activeIdx ? '1' : '0.6'}; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                  <img src="${url}" alt="Ảnh phụ ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                              `
                                )
                                .join('')}
                            </div>
                          `
                              : ''
                          }
                        </div>
                      `;
                    }
                  }

                  let formattedDescription = room.mo_ta || 'Không có mô tả chi tiết.';
                  formattedDescription = formattedDescription.replace(/\s*-\s*/g, '<br>- ');

                  const formatUtility = (val, suffix = ' đ') => {
                    if (!val && val !== 0) return 'Chưa có';
                    const strVal = String(val).trim();
                    const num = Number(strVal);
                    if (!isNaN(num)) {
                      return num.toLocaleString() + suffix;
                    }
                    return strVal;
                  };

                  return `
                    <div class="room-card-item" style="background: #ffffff; border: 1px solid #e2e8f0; padding: 28px; margin-bottom: 25px; border-radius: 16px; box-shadow: 0 4px 20px -2px rgba(0,0,0,0.04); display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: stretch; box-sizing: border-box; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;">
                      <div style="width: 100%;">${imagesHtml}</div>
                      
                      <div style="width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                          <h3 style="color: #1e3a8a; font-size: 22px; margin: 0 0 8px 0; font-weight: 700; word-break: break-word;">${
                            room.ten_phong || 'Phòng chưa có tên'
                          }</h3>
                          <div style="font-size: 21px; color: #16a34a; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.3px;">
                            ${
                              room.gia_phong
                                ? Number(room.gia_phong).toLocaleString() + ' đ / tháng'
                                : 'Liên hệ'
                            }
                          </div>
                          
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 14px; margin-bottom: 18px; color: #334155; word-break: break-word; background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid #f1f5f9;">
                            <div>📍 <strong>Địa chỉ:</strong> <span style="color: #475569;">${room.dia_chi || 'Chưa có'}</span></div>
                            <div>📏 <strong>Diện tích:</strong> <span style="color: #475569;">${room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'}</span></div>
                            <div>👥 <strong>Số người:</strong> <span style="color: #475569;">${room.so_nguoi || 'Chưa có'}</span></div>
                            <div>⚡ <strong>Điện:</strong> <span style="color: #475569;">${formatUtility(room.gia_dien, ' đ/số')}</span></div>
                            <div>💧 <strong>Nước:</strong> <span style="color: #475569;">${formatUtility(room.gia_nuoc, ' đ')}</span></div>
                            <div>🛠️ <strong>Dịch vụ:</strong> <span style="color: #475569;">${formatUtility(room.dich_vu, ' đ')}</span></div>
                          </div>
                        </div>
                        
                        <div style="background: #ffffff; padding: 14px 16px; border-radius: 10px; font-size: 14px; color: #475569; line-height: 1.6; border: 1px solid #e2e8f0; word-break: break-word;">
                          <strong style="color: #1e3a8a; display: block; margin-bottom: 4px;">Mô tả chi tiết:</strong> ${formattedDescription}
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </main>
    </div>

    <style>
      .room-card-item:hover {
        box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08);
        border-color: #cbd5e1;
      }
      @media (max-width: 768px) {
        .room-card-item {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
  `;

  document.getElementById('filter-price').value = currentPriceFilter;
  document.getElementById('filter-people').value = currentPeopleFilter;

  document.getElementById('filter-price').addEventListener('change', (e) => {
    currentPriceFilter = e.target.value;
    renderApp(getFilteredRooms());
  });
  document.getElementById('filter-people').addEventListener('change', (e) => {
    currentPeopleFilter = e.target.value;
    renderApp(getFilteredRooms());
  });
}

loadRooms();