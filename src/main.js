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

let selectedRoomData = { id: null, name: null };

window.changeRoomImage = function(roomId, index) {
  activeImageIndices[roomId] = index;
  renderApp(getFilteredRooms());
};

window.openBookingModal = function(roomId, roomName) {
  selectedRoomData = { id: roomId, name: roomName };
  const modal = document.getElementById('booking-modal');
  if (modal) modal.style.display = 'flex';
};

window.closeBookingModal = function() {
  selectedRoomData = { id: null, name: null };
  const modal = document.getElementById('booking-modal');
  if (modal) modal.style.display = 'none';
  const inputSdt = document.getElementById('customer-sdt');
  if (inputSdt) inputSdt.value = '';
};

window.submitBookingRequest = async function() {
  const sdtInput = document.getElementById('customer-sdt');
  const sdt = sdtInput ? sdtInput.value.trim() : '';

  if (!sdt || sdt.length < 9) {
    alert('Vui lòng nhập số điện thoại hợp lệ để chúng tôi liên hệ lại nhé!');
    return;
  }

  const payload = {
    room_id: String(selectedRoomData.id),
    ten_phong: selectedRoomData.name,
    sdt: sdt
  };

  const { error } = await supabase.from('requests').insert([payload]);

  if (error) {
    alert('Có lỗi xảy ra: ' + error.message);
  } else {
    alert('🎉 Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại với bạn qua số điện thoại này trong thời gian sớm nhất.');
    window.closeBookingModal();
  }
};

async function loadRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    document.querySelector('#app').innerHTML = `
      <div style="max-width: 600px; margin: 60px auto; padding: 25px; background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; color: #e11d48; text-align: center;">
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
  const schoolMapUrl = 'https://maps.app.goo.gl/6dHJdY1rpEsNK5QM7';

  appContainer.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; padding: 15px 5px;">
      
      <header style="background: linear-gradient(rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.45)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat; padding: 24px 16px; border-radius: 20px; box-shadow: 0 12px 35px -8px rgba(37, 99, 235, 0.15); border: 2px solid #e2e8f0; position: relative; overflow: hidden; margin-bottom: 20px;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #00c6ff, #0072ff, #9333ea, #db2777);"></div>
        
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div style="background: rgba(255, 255, 255, 0.95); padding: 8px; border-radius: 14px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); border: 1px solid #cbd5e1;">
            <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 65px; height: 65px; object-fit: contain;" />
          </div>
          <div style="flex-grow: 1; min-width: 0;">
            <h1 style="background: linear-gradient(135deg, #00c6ff, #0072ff, #9333ea, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; margin: 0 0 4px 0; font-weight: 900;">FindRoom</h1>
            <div style="font-size: 13px; color: #0369a1; font-weight: 700; background: rgba(224, 242, 254, 0.95); display: inline-block; padding: 4px 10px; border-radius: 20px; border: 1px solid #bae6fd;">🎓 Sinh viên năm 1 - ĐH Khoa học Thái Nguyên</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 2px dashed rgba(100,116,139,0.4);">
          <div style="background: rgba(255,255,255,0.95); padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: 700;">
            📍 Địa chỉ: <a href="${schoolMapUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">ĐH Khoa học Thái Nguyên</a>
          </div>
          <div style="background: rgba(255,255,255,0.95); padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 12px; font-weight: 700;">
            📞 SĐT: <span style="color: #475569;">0967711888</span>
          </div>
          <div style="background: #2563eb; color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;">
            🔥 Nhóm 5
          </div>
        </div>
      </header>

      <div style="background: linear-gradient(135deg, #ffffff 0%, #fdf4ff 100%); padding: 18px 20px; border-radius: 16px; border: 2px solid #fbcfe8; margin-bottom: 20px; text-align: center;">
        <p style="color: #0f172a; font-size: 14px; line-height: 1.6; font-style: italic; font-weight: 700; margin: 0;">
          "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý, đặc biệt là sinh viên năm nhất ĐH Khoa học Thái Nguyên."
        </p>
      </div>

      <div class="filter-container" style="background: #ffffff; padding: 16px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 2px solid #e2e8f0; border-top: 6px solid #2563eb; margin-bottom: 20px;">
        <div style="flex: 1 1 200px;">
          <label style="display: block; font-size: 13px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px;">💰 Khoảng giá phòng</label>
          <select id="filter-price">
            <option value="all">🌟 Tất cả mức giá</option>
            <option value="0-1000000">Dưới 1 triệu</option>
            <option value="1000000-2000000">1 triệu - 2 triệu</option>
            <option value="2000000-3000000">2 triệu - 3 triệu</option>
            <option value="3000000-4000000">3 triệu - 4 triệu</option>
            <option value="4000000-5000000">4 triệu - 5 triệu</option>
            <option value="5000000-999999999">Trên 5 triệu</option>
          </select>
        </div>
        <div style="flex: 1 1 200px;">
          <label style="display: block; font-size: 13px; font-weight: 800; color: #1e3a8a; margin-bottom: 4px;">👥 Số lượng người ở</label>
          <select id="filter-people">
            <option value="all">🌟 Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>
      </div>

      <main>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 17px; color: #1e3a8a; margin: 0; border-left: 5px solid #2563eb; padding-left: 8px; font-weight: 900;">Danh sách phòng trọ</h2>
          <span style="font-size: 12px; background: #2563eb; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-weight: 800;">✨ ${roomsToDisplay.length} phòng</span>
        </div>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #ffffff; padding: 30px; text-align: center; border-radius: 16px; color: #64748b; border: 2px dashed #cbd5e1; font-weight: 600;">🔍 Không tìm thấy phòng trọ phù hợp.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml = '<div style="width: 100%; height: 220px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 10px; color: #94a3b8; font-weight: 700; border: 2px dashed #cbd5e1;">Chưa có ảnh</div>';

                  if (room.hinh_anh) {
                    const imgUrls = room.hinh_anh.split(',').map((u) => u.trim()).filter((u) => u);
                    if (imgUrls.length > 0) {
                      let activeIdx = activeImageIndices[room.id] || 0;
                      if (activeIdx >= imgUrls.length) activeIdx = 0;

                      imagesHtml = `
                        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
                          <div style="width: 100%; height: 220px; background: #000; border-radius: 10px; overflow: hidden; position: relative; border: 2px solid #fff;">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng" style="width: 100%; height: 100%; object-fit: cover;" />
                            <div style="position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.6); color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;">Ảnh ${activeIdx + 1}/${imgUrls.length}</div>
                          </div>
                          ${
                            imgUrls.length > 1
                              ? `<div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
                              ${imgUrls.map((url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 48px; height: 48px; border-radius: 8px; border: ${idx === activeIdx ? '3px solid #2563eb' : '2px solid #cbd5e1'}; overflow: hidden; cursor: pointer; flex-shrink: 0; background: #fff;">
                                  <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                              `).join('')}
                            </div>`
                              : ''
                          }
                        </div>
                      `;
                    }
                  }

                  let formattedDescription = (room.mo_ta || 'Không có mô tả chi tiết.').split(/\r?\n/).map(l => l.trim()).filter(l => l).join('<br>');
                  const formatUtility = (val, suffix = ' đ') => {
                    if (!val && val !== 0) return 'Chưa có';
                    const num = Number(String(val).trim());
                    return !isNaN(num) ? num.toLocaleString() + suffix : val;
                  };

                  const mapUrl = room.map_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.dia_chi || '')}`;

                  return `
                    <div class="room-card-item">
                      <!-- Cột ảnh (Được style tự động co giãn qua file style.css) -->
                      <div class="room-image-col">${imagesHtml}</div>
                      
                      <!-- Cột thông tin -->
                      <div class="room-info-col">
                        <div>
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
                            <h3 style="color: #1e3a8a; font-size: 19px; margin: 0; font-weight: 800; word-break: break-word;">${room.ten_phong || 'Phòng trọ'}</h3>
                            <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 20px; text-transform: uppercase; white-space: nowrap;">Phòng trống</span>
                          </div>

                          <div style="font-size: 19px; color: #16a34a; font-weight: 900; margin-bottom: 10px;">
                            ${room.gia_phong ? Number(room.gia_phong).toLocaleString() + ' đ / tháng' : 'Liên hệ'}
                          </div>
                          
                          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 10px; border: 1px solid #e2e8f0;">
                            <div style="word-break: break-word;">📍 <strong>Địa chỉ:</strong> <a href="${mapUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${room.dia_chi || 'Chưa có'}</a></div>
                            <div style="display: flex; flex-wrap: wrap; gap: 12px; border-top: 1px dashed #cbd5e1; padding-top: 5px;">
                              <div>📏 <strong>Diện tích:</strong> ${room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'}</div>
                              <div>👥 <strong>Số người:</strong> ${room.so_nguoi || 'Chưa có'}</div>
                            </div>
                            <div style="display: flex; flex-wrap: wrap; gap: 12px; border-top: 1px dashed #cbd5e1; padding-top: 5px;">
                              <div>⚡ <strong>Điện:</strong> ${formatUtility(room.gia_dien, ' đ/số')}</div>
                              <div>💧 <strong>Nước:</strong> ${formatUtility(room.gia_nuoc, ' đ')}</div>
                              <div>🛠️ <strong>Dịch vụ:</strong> ${formatUtility(room.dich_vu, ' đ')}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div style="background: #ffffff; padding: 10px; border-radius: 8px; font-size: 12px; border: 2px dashed #cbd5e1; margin-bottom: 10px; word-break: break-word;">
                            <div style="color: #1e3a8a; margin-bottom: 2px; font-weight: 900;">📝 Mô tả chi tiết:</div> 
                            <div style="font-weight: 700; color: #334155;">${formattedDescription}</div>
                          </div>

                          <button onclick="window.openBookingModal('${room.id}', '${(room.ten_phong || 'Phòng trọ').replace(/'/g, "\\'")}')" style="width: 100%; background: #2563eb; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 14px; cursor: pointer;">
                            📞 Đăng ký thuê / Tư vấn phòng này ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </main>

      <div id="booking-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; padding: 12px;">
        <div style="background: #ffffff; max-width: 400px; width: 100%; padding: 20px; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 2px solid #e2e8f0;">
          <h3 style="color: #1e3a8a; font-size: 19px; margin-top: 0; margin-bottom: 6px; font-weight: 900;">🏠 Đăng ký tư vấn phòng trọ</h3>
          <p style="color: #64748b; font-size: 13px; margin-bottom: 14px;">Vui lòng nhập số điện thoại để nhóm quản lý FindRoom liên hệ lại!</p>
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 12px; font-weight: 800; color: #334155; margin-bottom: 4px;">📱 Số điện thoại liên hệ:</label>
            <input type="tel" id="customer-sdt" placeholder="Ví dụ: 0912345678" />
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.closeBookingModal()" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; cursor: pointer;">Hủy bỏ</button>
            <button onclick="window.submitBookingRequest()" style="background: #16a34a; color: #fff; border: none; cursor: pointer;">Gửi thông tin</button>
          </div>
        </div>
      </div>

    </div>
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