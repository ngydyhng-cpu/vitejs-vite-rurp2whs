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
      <div style="max-width: 600px; margin: 50px auto; padding: 20px; background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; color: #b91c1c; text-align: center;">
        <h2>Lỗi kết nối Supabase</h2>
        <p>${error.message}</p>
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%); min-height: 100vh; padding: 25px 15px; color: #334155;">
      
      <!-- Header -->
      <header style="max-width: 900px; margin: 0 auto 20px auto; background: #ffffff; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(30, 58, 138, 0.08); border-left: 6px solid #2563eb;">
        
        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 95px; height: 95px; object-fit: contain; flex-shrink: 0;" />
          
          <div style="flex-grow: 1;">
            <h1 style="color: #1e3a8a; font-size: 42px; margin: 0 0 6px 0; font-weight: 800; letter-spacing: 0.5px; line-height: 1.1;">FindRoom</h1>
            <div style="font-size: 15px; color: #475569; font-weight: 600; line-height: 1.4;">Đối tượng: Sinh viên năm 1 - trường Đại học Khoa học - Đại học Thái Nguyên</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📍 Địa chỉ:</span> <span style="font-weight: 500;">Phan Đình Phùng - Thái Nguyên</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 8px 14px; border-radius: 8px; border: 1px solid #e2e8f0; color: #334155; font-size: 13px; font-weight: 600;">
            <span>📞 SĐT:</span> <span style="font-weight: 500;">0123456789</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: #eff6ff; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid #bfdbfe; color: #1d4ed8;">
            <span>✨</span> <span>Nhóm 5</span>
          </div>
        </div>

      </header>

      <!-- Slogan -->
      <div style="max-width: 900px; margin: 0 auto 25px auto;">
        <p style="color: #1e293b; font-size: 18px; line-height: 1.6; font-style: italic; font-weight: 500; text-align: center; background: #ffffff; padding: 20px 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý. Mình mong muốn giúp các bạn, đặc biệt là sinh viên năm nhất trường Đại học Khoa học - Thái Nguyên, dễ dàng tìm kiếm và lựa chọn chỗ ở có giá cả và dịch vụ phù hợp với nhu cầu, tránh mất nhiều thời gian và gặp khó khăn khi tìm trọ."
        </p>
      </div>

      <!-- Bộ lọc -->
      <div style="max-width: 900px; margin: 0 auto 25px auto; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; border-top: 3px solid #3b82f6;">
        
        <div>
          <label style="display: block; font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 6px;">💰 Khoảng giá phòng</label>
          <select id="filter-price" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: #fff; outline: none;">
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
          <label style="display: block; font-size: 13px; font-weight: 600; color: #1e3a8a; margin-bottom: 6px;">👥 Số lượng người ở</label>
          <select id="filter-people" style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: #fff; outline: none;">
            <option value="all">Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>

      </div>

      <!-- Main Container -->
      <main style="max-width: 900px; margin: 0 auto;">
        <h2 style="font-size: 18px; color: #1e3a8a; margin-bottom: 20px; border-left: 4px solid #2563eb; padding-left: 10px; font-weight: 700;">
          Danh sách phòng trọ (${roomsToDisplay.length} kết quả)
        </h2>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #fff; padding: 40px; text-align: center; border-radius: 12px; color: #64748b;">Không tìm thấy phòng trọ phù hợp với bộ lọc.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml =
                    '<div style="width: 100%; height: 240px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; border-radius: 8px; color: #94a3b8; font-size: 14px;">Chưa có ảnh</div>';

                  if (room.hinh_anh) {
                    const imgUrls = room.hinh_anh
                      .split(',')
                      .map((url) => url.trim())
                      .filter((url) => url);
                    
                    if (imgUrls.length > 0) {
                      let activeIdx = activeImageIndices[room.id] || 0;
                      if (activeIdx >= imgUrls.length) activeIdx = 0;

                      imagesHtml = `
                        <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
                          <div style="width: 100%; height: 260px; background: #000; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng trọ chính" style="width: 100%; height: 100%; object-fit: cover;" />
                          </div>
                          
                          ${
                            imgUrls.length > 1
                              ? `
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%;">
                              ${imgUrls
                                .map(
                                  (url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 60px; height: 60px; border-radius: 6px; border: ${idx === activeIdx ? '2px solid #2563eb' : '1px solid #cbd5e1'}; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #fff; opacity: ${idx === activeIdx ? '1' : '0.7'}; transition: all 0.2s;">
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

                  // Xử lý mô tả: tự động bắt mọi kiểu dấu gạch ngang '-' để xuống dòng
                  let formattedDescription = room.mo_ta || 'Không có mô tả chi tiết.';
                  formattedDescription = formattedDescription.replace(/\s*-\s*/g, '<br>- ');

                  // Xử lý giá điện, nước, dịch vụ (nếu là số thì format, nếu là chữ/ký tự riêng thì giữ nguyên)
                  const formatUtility = (val, suffix = ' đ') => {
                    if (!val && val !== 0) return 'Chưa có';
                    const strVal = String(val).trim();
                    const num = Number(strVal);
                    if (!isNaN(num)) {
                      return num.toLocaleString() + suffix;
                    }
                    return strVal; // Nếu chứa chữ hoặc ký tự như '17000/1' thì in thẳng ra
                  };

                  return `
                    <div class="room-card-item" style="background: #ffffff; border: 1px solid #e2e8f0; padding: 26px; margin-bottom: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: stretch; box-sizing: border-box; overflow: hidden;">
                      <div style="width: 100%;">${imagesHtml}</div>
                      
                      <div style="width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                          <h3 style="color: #1e3a8a; font-size: 22px; margin: 0 0 10px 0; font-weight: 700; word-break: break-word;">${
                            room.ten_phong || 'Phòng chưa có tên'
                          }</h3>
                          <div style="font-size: 20px; color: #16a34a; font-weight: 700; margin-bottom: 14px;">
                            ${
                              room.gia_phong
                                ? Number(room.gia_phong).toLocaleString() + ' đ / tháng'
                                : 'Liên hệ'
                            }
                          </div>
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 15px; margin-bottom: 16px; color: #334155; word-break: break-word;">
                            <div>📍 <strong>Địa chỉ:</strong> ${
                              room.dia_chi || 'Chưa có'
                            }</div>
                            <div>📏 <strong>Diện tích:</strong> ${
                              room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'
                            }</div>
                            <div>👥 <strong>Số người:</strong> ${
                              room.so_nguoi || 'Chưa có'
                            }</div>
                            <div>⚡ <strong>Điện:</strong> ${formatUtility(room.gia_dien, ' đ/số')}</div>
                            <div>💧 <strong>Nước:</strong> ${formatUtility(room.gia_nuoc, ' đ')}</div>
                            <div>🛠️ <strong>Dịch vụ:</strong> ${formatUtility(room.dich_vu, ' đ')}</div>
                          </div>
                        </div>
                        
                        <div style="background: #f8fafc; padding: 14px 16px; border-radius: 8px; font-size: 15px; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; word-break: break-word; margin-top: 8px;">
                          <strong style="color: #1e3a8a; font-size: 15px;">Mô tả:</strong> ${formattedDescription}
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