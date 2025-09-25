# Locuno HD Bank Digital Platform

A modern, secure, and scalable digital banking platform built with cutting-edge technologies.

## Demo: 

- https://galaxy.locuno.com
- user: `test@locuno.com` / password: `testpassword123`

*(Scroll to bottom for English version)*

## 🏗️ Architecture

This is a monorepo containing:

- **Frontend**: Next.js application with static export
- **Backend**: Node.js/Express API server

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0


## 📁 Project Structure

```
locuno-hdbank/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   └── backend/           # Express.js backend API
├── packages/
│   ├── shared/            # Shared utilities and types
│   ├── ui/                # Reusable UI components
│   └── config/            # Shared configuration
├── docs/                  # Documentation
├── scripts/               # Deployment and utility scripts
├── config/                # Environment configurations
└── deployment.md          # Deployment guide
```

## 🔒 Security

This application handles sensitive financial data. Please review our security guidelines in [docs/security/README.md](./docs/security/README.md).


## 📄 License

This project is proprietary software owned by Locuno.

## Locuno: Kiến tạo Niềm tin cho Gia đình và Cộng đồng Việt Nam

Giữa lòng Việt Nam hiện đại, một nhu cầu cơ bản của con người vẫn tồn tại, thường không được đáp ứng bởi các giải pháp kỹ thuật số: nhu cầu về niềm tin. Sự thiếu hụt niềm tin này biểu hiện ở hai lĩnh vực riêng biệt nhưng lại có mối liên hệ sâu sắc trong cuộc sống hàng ngày.

Đối với các gia đình, đó là nỗi lo lắng thầm lặng, thường trực về sự an toàn của con cái và cha mẹ già. Đối với các cộng đồng, đó là sự nghi ngờ ăn mòn xung quanh việc quản lý các quỹ chung. Locuno nổi lên từ khoảng trống này, không chỉ đơn thuần là một ứng dụng, mà là một cơ sở hạ tầng tin cậy nền tảng được thiết kế để mang lại sự an tâm cho các gia đình và sự minh bạch triệt để cho tài chính cộng đồng.

### Vấn đề Kép của Niềm tin

Thách thức đầu tiên mang tính riêng tư và cá nhân. Mỗi bậc cha mẹ đã từng tự hỏi liệu con mình có đến trường an toàn hay không, hoặc mỗi người con trưởng thành lo lắng cho sức khỏe của cha mẹ ở quê nhà xa xôi, đều hiểu được nỗi lo lắng này. Nó xuất phát từ việc thiếu một phương thức kết nối riêng tư, an toàn và đáng tin cậy.

Thách thức thứ hai mang tính cộng đồng. Trong vô số các tòa nhà chung cư, hội phụ huynh học sinh và các nhóm khu phố, việc quản lý các quỹ tập thể là một nguồn gốc của sự xích mích. Được xử lý thủ công qua tin nhắn Zalo và bảng tính Excel, các quy trình này không rõ ràng, không hiệu quả và dễ bị quản lý sai, gây ra sự mất lòng tin và làm suy yếu sự gắn kết cộng đồng. Về cốt lõi, cả hai vấn đề đều có chung một gốc rễ: sự vắng mặt của một nền tảng kỹ thuật số được thiết kế đặc biệt để xây dựng và duy trì niềm tin.

### Một Nền tảng Hợp nhất cho Sự An tâm và Minh bạch

Locuno giải quyết thách thức kép này bằng một nền tảng duy nhất, thanh lịch, cung cấp hai trải nghiệm phù hợp: **Locuno Family** và **Locuno Community**.

**Locuno Family** là câu trả lời cho câu hỏi, "Những người thân yêu của tôi có ổn không?" Nó cung cấp một vòng tròn kỹ thuật số riêng tư, dựa trên sự đồng thuận, nơi các thành viên gia đình có thể chia sẻ vị trí và các chỉ số sức khỏe chính, chẳng hạn như kiểu ngủ và hoạt động thể chất. Đây không phải là về giám sát; đó là về nhận thức chung và sự chăm sóc lẫn nhau. Trải nghiệm được nâng cao bởi tính năng SOS khẩn cấp, một nút hoảng loạn kỹ thuật số tận dụng sức mạnh của cộng đồng bằng cách thông báo ngay lập tức cho một mạng lưới hàng xóm đã được xác minh eKYC, đảm bảo rằng sự giúp đỡ không bao giờ cách xa quá vài phút.

**Locuno Community** giải quyết trực diện sự thiếu minh bạch về tài chính với **Ví cộng đồng**. Tính năng này giới thiệu một mô hình mới để quản lý các quỹ chung, được xây dựng trên nguyên tắc giám sát dân chủ. Mọi chi tiêu phải trải qua một cuộc bỏ phiếu "Phê duyệt 2/3" từ các thành viên. Một giao dịch chỉ được thực hiện khi đạt được đa số này và toàn bộ quy trình—từ yêu cầu đến phê duyệt đến thanh toán—được ghi lại bất biến trên một sổ cái chung, theo thời gian thực. "Chuỗi khối logic kinh doanh" này mang lại sự minh bạch và toàn vẹn của công nghệ sổ cái phân tán mà không có sự phức tạp hoặc chi phí liên quan, giúp mọi đồng đô la đều có thể giải trình đầy đủ cho mọi thành viên.

### Kết nối Thế giới bằng Phần thưởng Thông minh: Công cụ Safe Deals 1K

Locuno kết nối liền mạch hai trải nghiệm này thông qua **Safe Deals 1K**, một công cụ phần thưởng độc quyền biến các hành động tích cực thành giá trị hữu hình. Bằng cách tham gia vào các thói quen lành mạnh hoặc tham gia có trách nhiệm vào cộng đồng của mình, người dùng sẽ được hưởng các ưu đãi và đấu giá độc quyền đối với các mặt hàng có giá trị cao từ hệ sinh thái Sovico, chẳng hạn như các chuyến bay của Vietjet hoặc các kỳ nghỉ tại khu nghỉ dưỡng. Lớp khuyến khích được trò chơi hóa này không chỉ thưởng cho người dùng; nó tạo ra một vòng tuần hoàn đạo đức, nơi sống tốt và hành động chính trực được liên kết trực tiếp với các lợi ích kinh tế, củng cố các giá trị cốt lõi của nền tảng.

### Chất xúc tác cho Sức mạnh tổng hợp của Hệ sinh thái

Locuno được thiết kế không phải là một sản phẩm độc lập, mà là một hệ điều hành khách hàng thân thiết cho toàn bộ hệ sinh thái Sovico. Đối với HDBank, nó thúc đẩy các giao dịch, tăng tiền gửi CASA và mở ra một kênh B2B2C mạnh mẽ vào các trường học và cộng đồng dân cư. Đối với Vietjet và các chi nhánh du lịch của Sovico, nó cung-cấp một kênh siêu hiệu quả để tối ưu hóa lợi nhuận trên hàng tồn kho chưa bán bằng cách nhắm mục tiêu vào nhóm nhân khẩu học gia đình có ý định cao. Đối với các đối tác bán lẻ, đó là một đường dây trực tiếp đến người tiêu dùng tham gia. Mối quan hệ cộng sinh này tạo ra một hiệu ứng mạng lưới mạnh mẽ, trong đó mỗi bộ phận của hệ sinh thái củng cố các bộ phận khác, với Locuno là trung tâm của niềm tin và sự tham gia.

### Tầm nhìn: Xây dựng Cơ sở hạ tầng Tin cậy của Việt Nam

Với một đội ngũ kết hợp kinh nghiệm sâu sắc trong việc xây dựng công nghệ cấp doanh nghiệp và mở rộng quy mô hoạt động dẫn đầu thị trường, chúng tôi có vị trí độc nhất để thực hiện tầm nhìn này. Chúng tôi không chỉ xây dựng một ứng dụng; chúng tôi đang xây dựng cơ sở hạ tầng tin cậy kỹ thuật số cho thế hệ tiếp theo của xã hội Việt Nam. Yêu cầu của chúng tôi rất đơn giản: một chương trình thí điểm trong hệ sinh thái Sovico để chứng minh rằng sự an toàn, minh bạch và tin cậy là những động lực mạnh mẽ và chưa được khai thác nhất của sự tăng trưởng và lòng trung thành trong nền kinh tế hiện đại.

---

## Locuno: Engineering Trust for Vietnam's Families and Communities

In the heart of modern Vietnam, a fundamental human need persists, often unmet by digital solutions: the need for trust. This trust deficit manifests in two distinct yet deeply connected spheres of daily life. For families, it is the quiet, constant worry for the safety of children and elderly parents. For communities, it is the corrosive suspicion that surrounds the management of shared funds. Locuno emerges from this gap, not merely as an application, but as a foundational trust infrastructure designed to bring peace of mind to families and radical transparency to community finances.

### The Dual Problem of Trust

The first challenge is intimate and personal. Every parent who has wondered if their child arrived safely at school, or every adult child concerned for their parents' well-being in a distant hometown, understands this anxiety. It stems from a lack of a private, secure, and reliable way to stay connected.

The second challenge is communal. In countless apartment buildings, school parent associations, and neighborhood groups, the management of collective funds is a source of friction. Handled manually through Zalo messages and Excel spreadsheets, these processes are opaque, inefficient, and ripe for mismanagement, breeding distrust and undermining community cohesion. At their core, both problems share a single root: the absence of a digital platform engineered specifically to build and maintain trust.

### A Unified Platform for Peace of Mind and Transparency

Locuno addresses this dual challenge with a single, elegant platform that offers two tailored experiences: **Locuno Family** and **Locuno Community**.

**Locuno Family** is the answer to the question, "Are my loved ones okay?" It provides a private, consent-based digital circle where family members can share location and key wellness indicators, such as sleep patterns and physical activity. This isn't about surveillance; it's about shared awareness and mutual care. The experience is elevated by an emergency SOS feature, a digital panic button that leverages the power of community by instantly alerting a network of eKYC-verified neighbors, ensuring that help is never more than a few minutes away.

**Locuno Community** tackles financial opacity head-on with the Community Wallet. This feature introduces a new paradigm for managing shared funds, built on a principle of democratic oversight. Every expenditure must undergo a "2/3 Approval" vote from the members. A transaction is only executed when this majority is reached, and the entire process—from request to approval to payment—is immutably recorded on a real-time, shared ledger. This "Business Logic Blockchain" delivers the transparency and integrity of distributed ledger technology without the associated complexity or cost, making every dollar fully accountable to every member.

### Bridging Worlds with Smart Rewards: The Safe Deals 1K Engine

Locuno seamlessly connects these two experiences through **Safe Deals 1K**, an exclusive rewards engine that transforms positive actions into tangible value. By engaging in healthy habits or participating responsibly in their communities, users earn access to exclusive deals and auctions for high-value inventory from the Sovico ecosystem, such as Vietjet flights or resort stays. This gamified incentive layer does more than just reward users; it creates a virtuous cycle where living well and acting with integrity are directly linked to economic benefits, reinforcing the platform's core values.

### A Catalyst for Ecosystem Synergy

Locuno is designed not as a standalone product, but as a loyalty operating system for the entire Sovico ecosystem. For HDBank, it drives transactions, increases CASA deposits, and opens a powerful B2B2C channel into schools and residential communities. For Vietjet and Sovico's tourism arms, it provides a hyper-efficient channel to optimize yield on unsold inventory by targeting a high-intent family demographic. For retail partners, it's a direct line to engaged consumers. This symbiotic relationship creates a powerful network effect, where each part of the ecosystem strengthens the others, with Locuno as the central hub of trust and engagement.

### The Vision: Building Vietnam's Trust Infrastructure

With a team that combines deep experience in building enterprise-grade technology and scaling market-leading operations, we are uniquely positioned to execute this vision. We are not just building an app; we are building the digital trust infrastructure for the next generation of Vietnamese society. Our ask is simple: a pilot program within the Sovico ecosystem to demonstrate that safety, transparency, and trust are the most potent and untapped drivers of growth and loyalty in the modern economy.
ocuno là trung tâm của niềm tin và sự tham gia.

### Tầm nhìn: Xây dựng Cơ sở hạ tầng Tin cậy của Việt Nam

Với một đội ngũ kết hợp kinh nghiệm sâu sắc trong việc xây dựng công nghệ cấp doanh nghiệp và mở rộng quy mô hoạt động dẫn đầu thị trường, chúng tôi có vị trí độc nhất để thực hiện tầm nhìn này. Chúng tôi không chỉ xây dựng một ứng dụng; chúng tôi đang xây dựng cơ sở hạ tầng tin cậy kỹ thuật số cho thế hệ tiếp theo của xã hội Việt Nam. Yêu cầu của chúng tôi rất đơn giản: một chương trình thí điểm trong hệ sinh thái Sovico để chứng minh rằng sự an toàn, minh bạch và tin cậy là những động lực mạnh mẽ và chưa được khai thác nhất của sự tăng trưởng và lòng trung thành trong nền kinh tế hiện đại.

---

## Locuno: Engineering Trust for Vietnam's Families and Communities

In the heart of modern Vietnam, a fundamental human need persists, often unmet by digital solutions: the need for trust. This trust deficit manifests in two distinct yet deeply connected spheres of daily life. For families, it is the quiet, constant worry for the safety of children and elderly parents. For communities, it is the corrosive suspicion that surrounds the management of shared funds. Locuno emerges from this gap, not merely as an application, but as a foundational trust infrastructure designed to bring peace of mind to families and radical transparency to community finances.

### The Dual Problem of Trust

The first challenge is intimate and personal. Every parent who has wondered if their child arrived safely at school, or every adult child concerned for their parents' well-being in a distant hometown, understands this anxiety. It stems from a lack of a private, secure, and reliable way to stay connected.

The second challenge is communal. In countless apartment buildings, school parent associations, and neighborhood groups, the management of collective funds is a source of friction. Handled manually through Zalo messages and Excel spreadsheets, these processes are opaque, inefficient, and ripe for mismanagement, breeding distrust and undermining community cohesion. At their core, both problems share a single root: the absence of a digital platform engineered specifically to build and maintain trust.

### A Unified Platform for Peace of Mind and Transparency

Locuno addresses this dual challenge with a single, elegant platform that offers two tailored experiences: **Locuno Family** and **Locuno Community**.

**Locuno Family** is the answer to the question, "Are my loved ones okay?" It provides a private, consent-based digital circle where family members can share location and key wellness indicators, such as sleep patterns and physical activity. This isn't about surveillance; it's about shared awareness and mutual care. The experience is elevated by an emergency SOS feature, a digital panic button that leverages the power of community by instantly alerting a network of eKYC-verified neighbors, ensuring that help is never more than a few minutes away.

**Locuno Community** tackles financial opacity head-on with the Community Wallet. This feature introduces a new paradigm for managing shared funds, built on a principle of democratic oversight. Every expenditure must undergo a "2/3 Approval" vote from the members. A transaction is only executed when this majority is reached, and the entire process—from request to approval to payment—is immutably recorded on a real-time, shared ledger. This "Business Logic Blockchain" delivers the transparency and integrity of distributed ledger technology without the associated complexity or cost, making every dollar fully accountable to every member.

### Bridging Worlds with Smart Rewards: The Safe Deals 1K Engine

Locuno seamlessly connects these two experiences through **Safe Deals 1K**, an exclusive rewards engine that transforms positive actions into tangible value. By engaging in healthy habits or participating responsibly in their communities, users earn access to exclusive deals and auctions for high-value inventory from the Sovico ecosystem, such as Vietjet flights or resort stays. This gamified incentive layer does more than just reward users; it creates a virtuous cycle where living well and acting with integrity are directly linked to economic benefits, reinforcing the platform's core values.

### A Catalyst for Ecosystem Synergy

Locuno is designed not as a standalone product, but as a loyalty operating system for the entire Sovico ecosystem. For HDBank, it drives transactions, increases CASA deposits, and opens a powerful B2B2C channel into schools and residential communities. For Vietjet and Sovico's tourism arms, it provides a hyper-efficient channel to optimize yield on unsold inventory by targeting a high-intent family demographic. For retail partners, it's a direct line to engaged consumers. This symbiotic relationship creates a powerful network effect, where each part of the ecosystem strengthens the others, with Locuno as the central hub of trust and engagement.

### The Vision: Building Vietnam's Trust Infrastructure

With a team that combines deep experience in building enterprise-grade technology and scaling market-leading operations, we are uniquely positioned to execute this vision. We are not just building an app; we are building the digital trust infrastructure for the next generation of Vietnamese society. Our ask is simple: a pilot program within the Sovico ecosystem to demonstrate that safety, transparency, and trust are the most potent and untapped drivers of growth and loyalty in the modern economy.


Join us at: https://locuno.com 
