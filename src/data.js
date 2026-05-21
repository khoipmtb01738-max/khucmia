// Mô phỏng trò chơi số 4: "Khúc Mía Nấu Thành Cơm" — Trại Hè Giáo Lý 2026
// Mục đích: giới thiệu cho cộng tác viên (CTV) hiểu luật & cách dẫn trò

export const GAME_META = {
  number: 4,
  name: 'Khúc Mía Nấu Thành Cơm',
  event: 'TRẠI HÈ GIÁO LÝ 2026',
}

export const STAFF = {
  lead: {
    name: 'Anh Minh Khôi',
    role: 'Phụ Trách Chính',
    icon: 'star',
    tasks: [
      'Đọc luật chơi và hướng dẫn khai mạc cho các đội',
      'Tổng điều phối, ra hiệu bắt đầu / kết thúc trò chơi',
      'Quyết định khi có tranh chấp giữa các đội',
      'Công bố kết quả chung cuộc và trao thưởng',
    ],
  },
  ctvs: [
    {
      name: 'Chị Quỳnh Thư',
      role: 'Quản giờ & Còi',
      icon: 'stopwatch',
      color: '#0ea5e9',
      tasks: [
        'Bấm đồng hồ 10 giây cho mỗi lượt rút thanh',
        'Hô to "BẮT ĐẦU" khi người chơi đến ống',
        'Thổi còi báo "HẾT GIỜ" khi đủ 10 giây',
      ],
    },
    {
      name: 'Chị Thanh Nhi',
      role: 'Đếm vòng xoay',
      icon: 'rotate',
      color: '#a855f7',
      tasks: [
        'Đứng cạnh vị trí chỉ định để xoay 5 vòng',
        'Đếm to và rõ "1 – 2 – 3 – 4 – 5"',
        'Bảo đảm người chơi xoay đủ số vòng mới được chạy',
      ],
    },
    {
      name: 'Chị Bích Thuỳ',
      role: 'Trọng tài ống',
      icon: 'clipboardCheck',
      color: '#16a34a',
      tasks: [
        'Đứng cạnh các ống nhựa, kiểm tra việc rút thanh đúng luật',
        'Bảo đảm chỉ rút 1 thanh, không di chuyển thanh sang lỗ khác',
        'Đếm số banh rơi ra sau mỗi lượt và báo cho Phụ Trách Chính',
      ],
    },
    {
      name: 'Chị Nguyệt Hà',
      role: 'Quản trật tự đội',
      icon: 'megaphone',
      color: '#f59e0b',
      tasks: [
        'Tổ chức các đội xếp hàng theo thứ tự lượt',
        'Gọi tên thành viên kế tiếp lên chuẩn bị',
        'Cổ vũ, giữ trật tự, không cho đội khác chen ngang',
      ],
    },
  ],
}

export const EQUIPMENT = [
  { icon: 'tube', label: 'Ống nhựa trong suốt', count: '9 ống', desc: 'Đứng thẳng, bên trong chứa banh và thanh gỗ' },
  { icon: 'circle', label: 'Trái banh nhỏ', count: '15 trái / ống', desc: 'Đặt sẵn bên trong ống, tựa trên các thanh gỗ' },
  { icon: 'stick', label: 'Thanh gỗ (đũa)', count: 'Nhiều thanh', desc: 'Xuyên qua các lỗ trên ống một cách không trật tự' },
  { icon: 'stopwatch', label: 'Đồng hồ bấm giờ', count: '1 cái', desc: 'Dùng để đếm 10 giây mỗi lượt rút' },
  { icon: 'whistle', label: 'Còi', count: '1 cái', desc: 'Báo hiệu bắt đầu và hết giờ' },
]

export const RULES = [
  'Mỗi đội cử lần lượt từng thành viên lên chơi.',
  'Mỗi lượt: 1 người chơi và phải hoàn thành trong 10 giây.',
  'Chỉ được rút 1 thanh gỗ mỗi lượt.',
  'KHÔNG được di chuyển thanh gỗ từ lỗ này sang lỗ khác.',
  'Nếu hết 10 giây mà chưa rút được → lượt đó tính KHÔNG rút.',
  'Kết thúc: đội nào còn số banh trong ống NHIỀU NHẤT sẽ thắng.',
]

export const PLAY_STEPS = [
  {
    n: 1,
    icon: 'mapPin',
    title: 'Di chuyển đến vị trí chỉ định',
    desc: 'Người chơi đi đến vạch xoay đã được CTV đánh dấu.',
  },
  {
    n: 2,
    icon: 'rotate',
    title: 'Xoay tại chỗ 5 vòng',
    desc: 'Cúi đầu, một tay chỉ xuống đất, xoay 5 vòng liên tục — Chị Thanh Nhi đếm to.',
  },
  {
    n: 3,
    icon: 'run',
    title: 'Chạy đến vị trí của ống',
    desc: 'Khi vừa xoay xong sẽ choáng váng, người chơi cố chạy đến ống của đội mình.',
  },
  {
    n: 4,
    icon: 'hand',
    title: 'Rút 1 thanh gỗ (trong 10s)',
    desc: 'Chọn và rút duy nhất 1 thanh. Chị Quỳnh Thư bấm giờ, Chị Bích Thuỳ giám sát.',
  },
  {
    n: 5,
    icon: 'cornerUpLeft',
    title: 'Chạy về vị trí xuất phát',
    desc: 'Hoàn tất lượt, chuyển người tiếp theo. Banh rơi ra (nếu có) được đếm.',
  },
]

export const TIPS = [
  'Trước khi bắt đầu: tập trung các đội thành vòng tròn để đọc luật chơi.',
  'Diễn thử 1 lượt MẪU cho cả nhóm xem trước khi tính điểm thật.',
  'CTV nên đứng đúng vị trí phân công — không di chuyển lung tung.',
  'Nhắc nhở an toàn: xoay 5 vòng rồi chạy có thể té, để khoảng trống rộng.',
  'Banh rơi không nên nhặt lại — để CTV đếm và ghi điểm.',
  'Khích lệ tinh thần: vỗ tay khi đội bạn rút được mà không rơi banh.',
]
