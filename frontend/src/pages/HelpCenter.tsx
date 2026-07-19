import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, CircleHelp, LifeBuoy, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

interface HelpArticle {
  id: number;
  category: 'POLICY' | 'FAQ' | 'GUIDE';
  titleVi: string;
  titleEn: string;
  contentVi: string;
  contentEn: string;
}

const articlesData: HelpArticle[] = [
  {
    id: 1,
    category: 'POLICY',
    titleVi: 'Chính sách Bồi thường của SARS',
    titleEn: 'SARS Compensation Policy',
    contentVi: 'Khách hàng có kiện hàng được bảo hiểm sẽ được hoàn tiền toàn bộ hoặc thay thế sản phẩm tương đương dựa theo giá trị khai báo của hàng hóa khi xảy ra sự cố thất lạc hoặc hư hỏng được xác nhận bởi bưu cục.',
    contentEn: 'Customers with insured parcels can receive a full refund or a replacement of equivalent product based on the declared value of the goods in case of confirmed loss or damage by the sorting hub.',
  },
  {
    id: 2,
    category: 'FAQ',
    titleVi: 'Phải làm gì khi mã vận đơn không cập nhật?',
    titleEn: 'What to do when tracking is stalled?',
    contentVi: 'Nếu kiện hàng không có cập nhật mới trong hơn 24 giờ, hệ thống SARS sẽ tự động phát hiện chậm trễ bất thường, mở một vụ việc phục hồi và gửi cảnh báo trực tiếp đến bạn.',
    contentEn: 'If the parcel has been inactive for more than 24 hours, the SARS system will automatically detect the abnormal delay, open a recovery case, and send a direct notification to you.',
  },
  {
    id: 3,
    category: 'GUIDE',
    titleVi: 'Cách thức hoạt động của các tùy chọn phục hồi',
    titleEn: 'How recovery options work',
    contentVi: 'Bạn có thể chọn Tiếp tục điều tra, Yêu cầu hoàn tiền hoặc Yêu cầu thay thế sản phẩm. Hệ thống sẽ tự động đề xuất tùy chọn tốt nhất dựa trên phân loại kiện hàng và mức độ bảo hiểm.',
    contentEn: 'You can choose to Continue Investigation, Request Refund, or Request Replacement. The system will automatically recommend the best option based on your parcel category and insurance status.',
  },
  {
    id: 4,
    category: 'FAQ',
    titleVi: 'Thời gian giải quyết tối đa là bao lâu?',
    titleEn: 'What is the maximum resolution time?',
    contentVi: 'Thời gian điều tra và giải quyết tối đa cho các đơn hàng bị kẹt là 72 giờ làm việc kể từ lúc hệ thống phát hiện sự cố.',
    contentEn: 'The maximum investigation and resolution time for stalled parcels is 72 working hours from the moment the system detects the issue.',
  },
  {
    id: 5,
    category: 'POLICY',
    titleVi: 'Mức phí bảo hiểm hàng hóa được tính thế nào?',
    titleEn: 'How is the cargo cargo insurance fee calculated?',
    contentVi: 'Phí bảo hiểm được tính bằng 0.5% giá trị khai báo của kiện hàng đối với các sản phẩm thương mại thông thường và đồ điện tử.',
    contentEn: 'The insurance fee is calculated at 0.5% of the declared value of the parcel for commercial goods and electronics.',
  }
];

export default function HelpCenter() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'POLICY' | 'FAQ' | 'GUIDE'>('ALL');

  const isVi = i18n.language === 'vi';

  const filteredArticles = articlesData.filter(article => {
    const title = isVi ? article.titleVi : article.titleEn;
    const content = isVi ? article.contentVi : article.contentEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{t('nav.help')}</p>
        <h1 className="text-3xl font-bold text-foreground">{t('help.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('help.subtitle')}</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        
        {/* Left Column: Contact and Categories */}
        <div className="space-y-6">
          
          {/* Support Contacts Card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <LifeBuoy size={18} className="text-primary animate-spin" style={{ animationDuration: '6s' }} />
                {t('help.contactSupport')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">{t('help.hotline')}</p>
                <p className="mt-1 text-primary font-bold text-lg">1900 1515</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">{t('help.email')}</p>
                <p className="mt-1 text-foreground">support@viettelpost.vn</p>
              </div>
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="font-semibold text-foreground">{t('help.officeHours')}</p>
                <p className="mt-1 text-muted-foreground">{t('help.officeHoursValue')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Categories card */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-secondary" />
                {t('help.articles')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {[
                { id: 'ALL', label: isVi ? 'Tất cả chuyên mục' : 'All Categories' },
                { id: 'POLICY', label: isVi ? 'Chính sách bồi thường' : 'Compensation Policies' },
                { id: 'FAQ', label: isVi ? 'Câu hỏi thường gặp' : 'FAQs' },
                { id: 'GUIDE', label: isVi ? 'Hướng dẫn quy trình' : 'Process Guides' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as never)}
                  className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Search and Articles List */}
        <div className="space-y-6">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('help.searchArticles')}
              className="w-full rounded-xl border border-input bg-background pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
            />
          </div>

          {/* Articles list */}
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <Card className="border-none shadow-md py-12 text-center">
                <CardContent className="py-6">
                  <p className="text-muted-foreground">{isVi ? 'Không tìm thấy bài viết nào phù hợp.' : 'No articles found matching your criteria.'}</p>
                </CardContent>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] tracking-wide font-bold">
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-foreground mt-2 flex items-center gap-2">
                      <CircleHelp size={16} className="text-primary shrink-0" />
                      {isVi ? article.titleVi : article.titleEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isVi ? article.contentVi : article.contentEn}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
