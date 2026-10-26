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
let visitorCount = 0;

let selectedRoomData = { id: null, name: null };

async function trackVisitor() {
  try {
    const hasVisited = sessionStorage.getItem('findroom_visited');
    
    if (!hasVisited) {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      if (!error && data !== null) {
        visitorCount = data;
        sessionStorage.setItem('findroom_visited', 'true');
      }
    } else {
      const { data } = await supabase.from('site_stats').select('views').eq('id', 1).single();
      if (data) visitorCount = data.views;
    }
  } catch (err) {
    console.error('Không thể cập nhật lượt truy cập:', err);
  }
}

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
  await trackVisitor();

  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    document.querySelector('#app').innerHTML = `
      <div style="max-width: 600px; margin: 60px auto; padding: 25px; background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; color: #e11d48; text-align: center;">
        <h2 style="margin-top: 0; font-size: 22px;">⚠️ Lỗi kết nối Supabase</h2>
        <p style="margin-bottom: 0; font-weight: 600;">${error.message}</p>
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
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; overflow-x: hidden; }
      .room-card-responsive {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 24px;
        align-items: center;
      }
      @media (max-width: 768px) {
        .room-card-responsive {
          grid-template-columns: 1fr !important;
        }
      }
    </style>

    <div style="font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #fef7ed; min-height: 100vh; padding: 25px 15px; color: #0f172a; width: 100%; box-sizing: border-box;">
      
      <header style="max-width: 950px; margin: 0 auto 24px auto; background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.5)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat; padding: 30px 24px; border-radius: 20px; box-shadow: 0 12px 35px -8px rgba(37, 99, 235, 0.15); border: 2px solid #cbd5e1; position: relative; overflow: hidden; width: 100%;">
        
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: linear-gradient(90deg, #00c6ff, #0072ff, #9333ea, #db2777);"></div>
        
        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          <div style="background: rgba(255, 255, 255, 0.95); padding: 10px; border-radius: 16px; box-shadow: 0 6px 15px rgba(0,0,0,0.1); border: 1px solid #cbd5e1;">
            <img src="https://tjfjzmyedgwkanbifots.supabase.co/storage/v1/object/public/rooms/OIP.jpg" alt="Logo TNUS" style="width: 80px; height: 80px; object-fit: contain; flex-shrink: 0;" />
          </div>
          
          <div style="flex-grow: 1; min-width: 240px;">
            <h1 style="background: linear-gradient(135deg, #00c6ff, #0072ff, #9333ea, #db2777); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 40px; margin: 0 0 4px 0; font-weight: 900; letter-spacing: -0.5px; line-height: 1.1;">FindRoom</h1>
            <div style="font-size: 14px; color: #0369a1; font-weight: 800; line-height: 1.4; background: rgba(224, 242, 254, 0.95); display: inline-block; padding: 5px 12px; border-radius: 20px; border: 1px solid #bae6fd;">🎓 Đối tượng: Sinh viên năm 1 - trường ĐH Khoa học - ĐH Thái Nguyên</div>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 22px; padding-top: 18px; border-top: 2px dashed rgba(100,116,139,0.4);">
          <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.95); padding: 9px 14px; border-radius: 12px; border: 1px solid #cbd5e1; color: #1e293b; font-size: 13px; font-weight: 800;">
            <span>📍 Địa chỉ:</span> 
            <a href="${schoolMapUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 800;">Đại học Khoa học - ĐH Thái Nguyên</a>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.95); padding: 9px 14px; border-radius: 12px; border: 1px solid #cbd5e1; color: #1e293b; font-size: 13px; font-weight: 800;">
            <span>📞 SĐT:</span> <span style="font-weight: 800; color: #1e293b;">0967711888</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.95); padding: 9px 14px; border-radius: 12px; border: 1px solid #cbd5e1; color: #1e293b; font-size: 13px; font-weight: 800;">
            <span>👁️ Lượt xem:</span> <span style="color: #2563eb; font-weight: 900;">${visitorCount.toLocaleString()}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 9px 14px; border-radius: 12px; font-size: 13px; font-weight: 900; color: #ffffff;">
            <span>🔥</span> <span>Nhóm 5</span>
          </div>
        </div>
      </header>

      <div style="max-width: 950px; margin: 0 auto 24px auto; width: 100%;">
        <div style="background: linear-gradient(135deg, #ffffff 0%, #fdf4ff 100%); padding: 22px; border-radius: 16px; border: 2px solid #fbcfe8; box-shadow: 0 8px 20px rgba(219,39,119,0.06); position: relative;">
          <div style="position: absolute; top: -12px; left: 22px; background: #db2777; color: #fff; font-size: 11px; font-weight: 900; padding: 3px 12px; border-radius: 8px; text-transform: uppercase;">Sứ mệnh của chúng tôi</div>
          <p style="color: #0f172a; font-size: 16px; line-height: 1.65; font-style: italic; font-weight: 800; text-align: center; margin: 6px 0 0 0;">
            "Sứ mệnh của FindRoom là giúp sinh viên tìm được nơi ở phù hợp, an toàn và thuận tiện với mức giá hợp lý. Mình mong muốn giúp các bạn, đặc biệt là sinh viên năm nhất trường Đại học Khoa học - Thái Nguyên, dễ dàng tìm kiếm và lựa chọn chỗ ở có giá cả và dịch vụ phù hợp với nhu cầu, tránh mất nhiều thời gian và gặp khó khăn khi tìm trọ."
          </p>
        </div>
      </div>

      <div style="max-width: 950px; margin: 0 auto 24px auto; background: #ffffff; padding: 22px; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; border: 2px solid #cbd5e1; border-top: 6px solid #2563eb; width: 100%;">
        <div>
          <label style="display: block; font-size: 14px; font-weight: 900; color: #1e3a8a; margin-bottom: 8px;">💰 Khoảng giá phòng</label>
          <select id="filter-price" style="width: 100%; padding: 11px; border: 2px solid #cbd5e1; border-radius: 10px; font-size: 15px; font-weight: 800; background: #f8fafc; color: #1e293b; cursor: pointer;">
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
          <label style="display: block; font-size: 14px; font-weight: 900; color: #1e3a8a; margin-bottom: 8px;">👥 Số lượng người ở</label>
          <select id="filter-people" style="width: 100%; padding: 11px; border: 2px solid #cbd5e1; border-radius: 10px; font-size: 15px; font-weight: 800; background: #f8fafc; color: #1e293b; cursor: pointer;">
            <option value="all">🌟 Tất cả số người</option>
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
          </select>
        </div>
      </div>

      <main style="max-width: 950px; margin: 0 auto; width: 100%;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
          <h2 style="font-size: 20px; color: #1e3a8a; margin: 0; border-left: 6px solid #2563eb; padding-left: 12px; font-weight: 900;">
            Danh sách phòng trọ
          </h2>
          <span style="font-size: 13px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-weight: 900;">
            ✨ ${roomsToDisplay.length} phòng
          </span>
        </div>

        ${
          roomsToDisplay.length === 0
            ? '<div style="background: #ffffff; padding: 50px; text-align: center; border-radius: 16px; color: #64748b; border: 2px dashed #cbd5e1; font-weight: 800; font-size: 15px;">🔍 Không tìm thấy phòng trọ phù hợp.</div>'
            : roomsToDisplay
                .map((room) => {
                  let imagesHtml =
                    '<div style="width: 100%; height: 260px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: #94a3b8; font-size: 14px; font-weight: 800; border: 2px dashed #cbd5e1;">Chưa có ảnh</div>';

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
                          <div style="width: 100%; height: 260px; background: #000; border-radius: 12px; overflow: hidden; position: relative; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <img src="${imgUrls[activeIdx]}" alt="Ảnh phòng" style="width: 100%; height: 100%; object-fit: cover;" />
                            <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: #fff; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 800;">Ảnh ${activeIdx + 1}/${imgUrls.length}</div>
                          </div>
                          
                          ${
                            imgUrls.length > 1
                              ? `
                            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; width: 100%;">
                              ${imgUrls
                                .map(
                                  (url, idx) => `
                                <div onclick="window.changeRoomImage('${room.id}',${idx})" style="width: 60px; height: 60px; border-radius: 8px; border: ${idx === activeIdx ? '3px solid #2563eb' : '2px solid #cbd5e1'}; overflow: hidden; flex-shrink: 0; cursor: pointer; background: #fff;">
                                  <img src="${url}" alt="Thumbnail" style="width: 100%; height: 100%; object-fit: cover;" />
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

                  let rawDesc = room.mo_ta || 'Không có mô tả chi tiết.';
                  let formattedDescription = rawDesc
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line)
                    .join('<br style="display: block; margin: 3px 0;">');

                  const formatUtility = (val, suffix = ' đ') => {
                    if (!val && val !== 0) return 'Chưa có';
                    const num = Number(String(val).trim());
                    return !isNaN(num) ? num.toLocaleString() + suffix : val;
                  };

                  const mapUrl = room.map_link ? room.map_link : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.dia_chi || '')}`;
                  const roomNameForBooking = room.ten_phong || 'Phòng trọ';
                  const roomIdForBooking = room.id;

                  return `
                    <div style="background: #ffffff; border: 2px solid #cbd5e1; padding: 24px; margin-bottom: 24px; border-radius: 18px; box-shadow: 0 10px 30px -5px rgba(30,58,138,0.08); width: 100%; box-sizing: border-box;">
                      <div class="room-card-responsive" style="width: 100%;">
                        <div style="width: 100%;">${imagesHtml}</div>
                        
                        <div style="width: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                          <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 8px;">
                              <h3 style="color: #1e3a8a; font-size: 22px; margin: 0; font-weight: 900; word-break: break-word;">${roomNameForBooking}</h3>
                              <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; white-space: nowrap;">Phòng trống</span>
                            </div>

                            <div style="font-size: 22px; color: #16a34a; font-weight: 900; margin-bottom: 14px;">
                              ${room.gia_phong ? Number(room.gia_phong).toLocaleString() + ' đ / tháng' : 'Liên hệ'}
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr; gap: 9px; font-size: 14px; margin-bottom: 16px; color: #1e293b; background: #f8fafc; padding: 14px; border-radius: 12px; border: 2px solid #cbd5e1; width: 100%; box-sizing: border-box; font-weight: 800;">
                              <div>📍 <strong style="color: #0f172a;">Địa chỉ:</strong> <a href="${mapUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; font-weight: 900;">${room.dia_chi || 'Chưa có'}</a> ${room.khoang_cach ? `<span style="color: #e11d48; font-weight: 900;">(Cách trường: ${room.khoang_cach})</span>` : ''}</div>
                              <div>📏 <strong style="color: #0f172a;">Diện tích:</strong> <span style="font-weight: 800; color: #334155;">${room.dien_tich ? room.dien_tich + ' m²' : 'Chưa có'}</span></div>
                              <div>👥 <strong style="color: #0f172a;">Số người:</strong> <span style="font-weight: 800; color: #334155;">${room.so_nguoi || 'Chưa có'}</span></div>
                              <div>⚡ <strong style="color: #0f172a;">Điện:</strong> <span style="font-weight: 800; color: #334155;">${formatUtility(room.gia_dien, ' đ/số')}</span></div>
                              <div>💧 <strong style="color: #0f172a;">Nước:</strong> <span style="font-weight: 800; color: #334155;">${formatUtility(room.gia_nuoc, ' đ')}</span></div>
                              <div>🛠️ <strong style="color: #0f172a;">Dịch vụ:</strong> <span style="font-weight: 800; color: #334155;">${formatUtility(room.dich_vu, ' đ')}</span></div>
                            </div>
                          </div>
                          
                          <div>
                            <div style="background: #ffffff; padding: 12px 14px; border-radius: 12px; font-size: 14px; color: #0f172a; border: 2px dashed #cbd5e1; margin-bottom: 14px; box-sizing: border-box;">
                              <div style="color: #1e3a8a; margin-bottom: 4px; font-weight: 900;">📝 Mô tả chi tiết:</div> 
                              <div style="font-weight: 800; color: #1e293b; word-break: break-word; line-height: 1.5;">${formattedDescription}</div>
                            </div>

                            <button onclick="window.openBookingModal('${roomIdForBooking}', '${roomNameForBooking.replace(/'/g, "\\'")}')" style="width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; border: none; padding: 12px; border-radius: 12px; font-weight: 900; font-size: 15px; cursor: pointer; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                              📞 Đăng ký thuê / Tư vấn phòng ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                })
                .join('')
        }
      </main>

      <div id="booking-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box;">
        <div style="background: #ffffff; max-width: 420px; width: 100%; padding: 28px; border-radius: 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 2px solid #cbd5e1; box-sizing: border-box;">
          
          <h3 style="color: #1e3a8a; font-size: 22px; margin-top: 0; margin-bottom: 10px; font-weight: 900;">🏠 Đăng ký tư vấn phòng</h3>
          <p style="color: #475569; font-size: 14px; margin-bottom: 18px; line-height: 1.5; font-weight: 800;">
            Nhập số điện thoại của bạn, nhóm FindRoom sẽ liên hệ lại ngay!
          </p>

          <div style="margin-bottom: 18px;">
            <label style="display: block; font-size: 13px; font-weight: 900; color: #1e293b; margin-bottom: 6px;">📱 Số điện thoại:</label>
            <input type="tel" id="customer-sdt" placeholder="Ví dụ: 0912345678" style="width: 100%; padding: 11px; border: 2px solid #cbd5e1; border-radius: 10px; font-size: 15px; font-weight: 800; box-sizing: border-box;" />
          </div>

          <div style="display: flex; gap: 10px;">
            <button onclick="window.closeBookingModal()" style="flex: 1; background: #f1f5f9; color: #475569; border: 2px solid #cbd5e1; padding: 11px; border-radius: 10px; font-weight: 900; font-size: 14px; cursor: pointer;">
              Hủy bỏ
            </button>
            <button onclick="window.submitBookingRequest()" style="flex: 1; background: #16a34a; color: #ffffff; border: none; padding: 11px; border-radius: 10px; font-weight: 900; font-size: 14px; cursor: pointer;">
              Gửi thông tin
            </button>
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