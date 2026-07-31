import { cultivationRanks } from './cultivationRanks';
import type { CultivationLevel, CultivationPhase } from './types';

const ranksById = Object.fromEntries(cultivationRanks.map(rank => [rank.id, rank]));

type LevelDetails = Omit<CultivationLevel, 'id' | 'rank' | 'name' | 'requiredPoints'>;

function level(id: string, details: LevelDetails): CultivationLevel {
  const rank = ranksById[id];
  if (!rank) throw new Error(`Unknown cultivation rank: ${id}`);

  return { ...details, id, rank: rank.rank, name: rank.name, requiredPoints: rank.threshold };
}

export const cultivationPhases: CultivationPhase[] = [
  {
    id: 'ha-canh-gioi',
    name: 'Hạ Cảnh Giới',
    subtitle: 'Đặt nền móng cho con đường tu luyện',
    rankTheme: 'lower',
    levels: [
      level('luyen-khi', {
        description: 'Bước đầu thu nạp linh khí từ thiên địa để cải thiện cơ thể.',
        status: 'completed',
        requirements: ['Hoàn thành 3 buổi tập', 'Duy trì chuỗi hoạt động 3 ngày'],
        reward: 'Mở khóa danh hiệu Người nhập môn',
      }),
      level('truc-co', {
        description: 'Cải tạo thân thể, xây dựng căn cơ tu luyện, là bước ngoặt quan trọng.',
        status: 'completed',
        requirements: ['Hoàn thành 12 buổi tập', 'Tích lũy 1.000 điểm rèn luyện'],
        reward: 'Mở khóa khung hồ sơ Trúc Cơ',
      }),
      level('ket-dan', {
        description: 'Xuất hiện kim đan, đánh dấu sự kết tinh năng lượng.',
        status: 'current',
        progress: 68,
        requirements: ['Hoàn thành thêm 4 buổi tập', 'Giữ chuỗi hoạt động 7 ngày', 'Đạt 2.500 điểm rèn luyện'],
        reward: 'Mở khóa huy hiệu Kim Đan',
      }),
      level('nguyen-anh', {
        description: 'Luyện hồn thành thai, nâng cao khả năng nhận thức.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Kết Đan', 'Duy trì hoạt động 14 ngày'],
        reward: 'Mở khóa huy hiệu Nguyên Anh',
      }),
      level('hoa-than', {
        description: 'Giai đoạn cao nhất trong Hạ Cảnh Giới, chuẩn bị cho thăng cấp.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Nguyên Anh', 'Tích lũy 10.000 điểm rèn luyện'],
        reward: 'Mở khóa cổng Trung Cảnh Giới',
      }),
    ],
  },
  {
    id: 'trung-canh-gioi',
    name: 'Trung Cảnh Giới',
    subtitle: 'Dung hợp sức mạnh và ý chí bền bỉ',
    rankTheme: 'middle',
    levels: [
      level('luyen-hu', {
        description: 'Tăng cường sức mạnh và khả năng điều khiển linh khí.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Hóa Thần', 'Duy trì 20 buổi tập trong 30 ngày'],
        reward: 'Mở khóa danh hiệu Luyện Hư',
      }),
      level('hop-the', {
        description: 'Kết hợp linh hồn và thể xác, đạt được sức mạnh vượt trội.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Luyện Hư', 'Đạt 25.000 điểm rèn luyện'],
        reward: 'Mở khóa khung hồ sơ Hợp Thể',
      }),
      level('dai-thua', {
        description: 'Cấp độ cao nhất trong Trung Cảnh Giới, có thể làm rung chuyển Thiên Địa.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Hợp Thể', 'Duy trì chuỗi hoạt động 30 ngày'],
        reward: 'Mở khóa cổng Thượng Cảnh Giới',
      }),
    ],
  },
  {
    id: 'thuong-canh-gioi',
    name: 'Thượng Cảnh Giới',
    subtitle: 'Một bước vượt qua thiên kiếp, chạm tới tiên giới',
    rankTheme: 'upper',
    levels: [
      level('do-kiep', {
        description: 'Thử thách quyết định xem tu tiên giả có thể thăng cấp lên tiên giới hay không.',
        status: 'locked',
        requirements: ['Hoàn thành cảnh giới Đại Thừa', 'Chinh phục 50.000 điểm rèn luyện', 'Hoàn thành thử thách Thiên Kiếp'],
        reward: 'Danh hiệu Tiên Nhân và quyền năng tối thượng',
      }),
    ],
  },
];
