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
      <div style="max-width: 600px; margin: 60px auto; padding: 25px; background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; color: #e11d48; text-align: center; box-shadow: 0 10px 25px rgba(225,29,72,0.1);">
        <h2 style="margin-top: 0; font-size: 22px;">⚠️ Lỗi kết nối Supabase</h2>
        <p style="margin-bottom: 0; font-weight: 500;">${error.message}</p>
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
    <div style="font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f8fafc; min-height: 100vh; padding: 35px 15px; color: #1e293b;">
      
      <!-- Header với ảnh nền độ đậm 65% -->
      <header style="max-width: 900px; margin: 0 auto 24px auto; background: linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.45)), url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat; padding: 36px; border-radius: 24px; box-shadow: 0 12px 35px -8px rgba(37, 99, 235, 0.15); border: 2px solid #e2e8f0; position: relative; overflow: hidden;">
        
        <!-- Dải màu trang trí phía trên header -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #2563eb, #db2777, #9333ea);"></div>
        
        <div style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <div style="background: rgba(255, 255, 255, 0.95); padding: 10px; border-radius: 18px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); border: 1px solid #cbd5e1;">
            <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 85px; height: 85px; object-fit: contain; flex-shrink: 0;" />
          </div>
          
          <div style="flex-grow: 1;">
            <h1 style="color: #1e3a8a; font-size: 44px; margin: 0 0 4px 0; font-weight: 900; letter-spacing: -0.5px; line-height: 1.1; text-shadow: 0 2px 4px rgba(255,255,255,0.9);">FindRoom</h1>
            <div style="font-size: 15px; color: #0369a1; font-weight: 700; line-height: 1.4; background: rgba(224, 242, 254, 0.95); display: inline-block; padding: 4px 12px; border-radius: 20px; border: 1px solid #bae6fd;">🎓 Đối tượng: Sinh viên năm 1 - trường Đại học Khoa học - Đại học Thái Nguyên</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 26px; padding-top: 20px; border-top: 2px dashed rgba(100,116,139,0.4);">
          <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.95); padding: 9px 16px; border-radius: 12px; border: 1px solid #cbd5e1; color: #334155; font-size: 13px; font-weight: 700; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <span>📍 Địa chỉ:</span> <span style="font-weight: 500; color: #475569;">Phan Đình Phùng - Thái Nguyên</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.95); padding: 9px 16px; border-radius: 12px; border: 1px solid #cbd5e1; color: #334155; font-size: 13px; font-weight: 700; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <span>📞 SĐT:</span> <span style="font-weight: 500; color: #475569;">0123456789</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 9px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; color: #ffffff; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
            <span>🔥</span> <span>Nhóm 5</span>
          </div>
        </div>
      </header>

      <!-- Slogan -->
      <div style="max-width: 900px; margin: 0 auto 25px auto;">
        <div style="background: linear-gradient(135deg, #ffffff 0%, #fdf4ff 100%); padding: 24px 30px; border-radius: 20px; border: 2px solid #fbcfe8; box-shadow: 0 8px 20px rgba(219,39,119,0.06); position: relative;">
          <div style="position: absolute; top: -14px; left: 24px; background: #db2777; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 12px; border-radius: 10px; text-transform: uppercase; letter-spacing: 1px;">Sứ mệnh của chúng tôi</div>
          <p style="color: #475569; font-size: 16px; line-height: 1.7; font-style: italic; font-weight: 600; text-align: center; margin: 4px 0 0 0;">
            "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý. Mình mong muốn giúp các bạn, đặc biệt là sinh viên năm nhất trường Đại học Khoa học - Thái Nguyên, dễ dàng tìm kiếm và lựa chọn chỗ ở có giá cả và dịch vụ phù hợp với nhu cầu, tránh mất nhiều thời gian và gặp khó khăn khi tìm trọ."
          </p>
        </div>
      </div>

      <!-- Bộ lọc -->
      <div style="max-width: 900px; margin: 0 auto 25px auto; background: #ffffff; padding: 24px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; border: 2px solid #e2e8f0; border-top: 6px solid #2563eb;">
        
        <div>
          <label style="display: block; font-size: 14px; font-weight: 800; color: #1e3a8a; margin-bottom: 8px;">💰 Khoảng giá phòng</label>
          <select id="filter-price" style="width: 100%; padding: 12px 16px; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 14px; font-weight: 600; background: #f8fafc; outline: none; cursor: pointer; color: #334155;">
            <option value="all">🌟 Tất cả mức giá</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-2000000">1 triệu - 2 triệu</option>
            <option value="2000000-3000000">2 triệu - 3 triệu</option>
            <option value="3000000-4000000">3 triệu - 4 triệu</option>
            <option value="4000000-5000000">4 triệu - 5 triệu</option>
            <option value="5000000-999999999">Trên 5 triệu</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 14px; font-weight: 800; color: #1e3a8a; margin-bottom: 8px;">👥 Số lượng người ở</label>
          <select id="filter-people" style="width: 100%; padding: 12px 16px; border: 2px solid #cbd5e1; border-radius: 12px; font-size: 14px; font-weight: 600; background: #f8fafc; outline: none; cursor: pointer; color: #334155;">
            <option value="all">🌟 Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>

      </div>

      <!-- Main Container -->
      <main style="max-width: 900px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px;">
          <h2 style="font-size: 20px; color: #1e3a8a; margin: 0; border-left: 6px solid #2563eb; padding-left: 12px; font-weight: 900;">
            Danh sách phòng trọ
          </h2>
          <span style="font-size: 13px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: 800; box-shadow: 0 4px 10px rgba(37,99,235,0.3);">
            ✨ Tìm thấy ${roomsToDisplay.length} phòng
          </span>
        </div>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #ffffff; padding: 60px; text-align: center; border-radius: 20px; color: #64748b; border: 2px dashed #cbd5e1; font-weight: 600; font-size: 16px;">🔍 Không tìm thấy phòng trọ phù hợp với bộ lọc của bạn.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml =
                    '<div style="width: 100%; height: 260px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: #94a3b8; font-size: 14px; font-weight: 700; border: 2px dashed #cbd5e1;">Chưa có ảnh</div>';

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
                          <div style="width: 100%; height: 260px; background: #000; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.12); position: relative; border: 2px solid #ffffff;">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng trọ chính" style="width: 100%; height: 100%; object-fit: cover;" />
                            <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 700;">Ảnh ${activeIdx + 1}/${imgUrls.length}</div>
                          </div>
                          
                          ${
                            imgUrls.length > 1
                              ? `
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%;">
                              ${imgUrls
                                .map(
                                  (url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 65px; height: 65px; border-radius: 10px; border: ${idx === activeIdx ? '3px solid #2563eb' : '2px solid #cbd5e1'}; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #fff; opacity: ${idx === activeIdx ? '1' : '0.6'}; transition: all 0.2s; box-shadow: 0 3px 8px rgba(0,0,0,0.08);">
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
                    <div class="room-card-item" style="background: #ffffff; border: 2px solid #e2e8f0; padding: 28px; margin-bottom: 25px; border-radius: 20px; box-shadow: 0 10px 30px -5px rgba(30,58,138,0.06); display: grid; grid-template-columns: 320px 1fr; gap: 26px; align-items: stretch; box-sizing: border-box; overflow: hidden; transition: all 0.3s ease;">
                      <div style="width: 100%;">${imagesHtml}</div>
                      
                      <div style="width: 100%; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 6px;">
                            <h3 style="color: #1e3a8a; font-size: 23px; margin: 0; font-weight: 800; word-break: break-word; letter-spacing: -0.3px;">${
                              room.ten_phong || 'Phòng chưa có tên'
                            }</h3>
                            <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; white-space: nowrap;">Phòng trống</span>
                          </div>

                          <!-- Đã chỉnh giá tiền chính xác sang màu xanh lá -->
                          <div style="font-size: 22px; color: #16a34a; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.5px;">
                            ${
                              room.gia_phong
                                ? Number(room.gia_phong).toLocaleString() + ' đ / tháng'
                                : 'Liên hệ'
                            }
                          </div>
                          
                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; margin-bottom: 18px; color: #334155; word-break: break-word; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 16px; border-radius: 14px; border: 1px solid #e2e8f0;">
                            <div>📍 <strong>Địa chỉ:</strong> <span style="color: #475569; font-weight: 600;">${room.dia_chi || 'Chưa có'}</span></div>
                            <div>📏 <strong>Diện tích:</strong> <span style="color: #475569; font-weight: 600;">${room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'}</span></div>
                            <div>👥 <strong>Số người:</strong> <span style="color: #475569; font-weight: 600;">${room.so_nguoi || 'Chưa có'}</span></div>
                            <div>⚡ <strong>Điện:</strong> <span style="color: #475569; font-weight: 600;">${formatUtility(room.gia_dien, ' đ/số')}</span></div>
                            <div>💧 <strong>Nước:</strong> <span style="color: #475569; font-weight: 600;">${formatUtility(room.gia_nuoc, ' đ')}</span></div>
                            <div>🛠️ <strong>Dịch vụ:</strong> <span style="color: #475569; font-weight: 600;">${formatUtility(room.dich_vu, ' đ')}</span></div>
                          </div>
                        </div>
                        
                        <div style="background: #ffffff; padding: 14px 18px; border-radius: 12px; font-size: 14px; color: #475569; line-height: 1.6; border: 2px dashed #cbd5e1; word-break: break-word;">
                          <strong style="color: #1e3a8a; display: block; margin-bottom: 4px; font-size: 14px;">📝 Mô tả chi tiết:</strong> ${formattedDescription}
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
        transform: translateY(-4px);
        box-shadow: 0 16px 40px -10px rgba(37,99,235,0.15);
        border-color: #3b82f6;
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