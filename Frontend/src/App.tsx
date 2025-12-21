import { Button, DatePicker, Space, message } from 'antd';

function App() {
  const handleClick = () => {
    message.success('Đã kết nối thành công!');
    // Thử gọi API .NET ở đây sau này
  };

  return (
    <div style={{ padding: 50 }}>
      <Space direction="vertical">
        <h1>Frontend: React + Ant Design</h1>
        <DatePicker />
        <Button type="primary" onClick={handleClick}>
          Test Ant Design Button
        </Button>
      </Space>
    </div>
  );
}

export default App;