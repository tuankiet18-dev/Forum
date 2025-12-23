import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert, ConfigProvider } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { RegisterRequest } from '../types/auth.types';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Màu chủ đạo lấy theo màu nút bấm trong hình (Dark Blue)
  const primaryColor = '#1e3a8a'; 

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    setErrors([]);
    
    try {
      const res = await authService.register(values);
      if (res.success) {
        message.success('Registration successful!');
        navigate('/'); // Hoặc navigate về login tùy luồng
      } else {
        if (res.errors && res.errors.length > 0) {
          setErrors(res.errors);
        } else {
          message.error(res.message || 'Registration failed');
        }
      }
    } catch (error: any) {
        setErrors(['Unable to connect to the server.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
            Input: {
                controlHeightLG: 45, // Chỉnh chiều cao input giống trong hình
                activeBorderColor: primaryColor,
                hoverBorderColor: primaryColor,
            },
            Button: {
                controlHeightLG: 45, // Chiều cao button bằng input
                fontWeight: 600,
            }
        }
      }}
    >
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh', 
          backgroundColor: '#f8fafc', // Màu nền xám nhạt (Slate-50) giống hình
          padding: '20px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px' }}>
          
          {/* HEADER SECTION: Icon & Title bên ngoài Card */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 64, height: 64, 
                backgroundColor: 'rgba(30, 58, 138, 0.1)', // Màu nền icon nhạt
                borderRadius: '16px', 
                marginBottom: 16,
                color: primaryColor
            }}>
                <UserAddOutlined style={{ fontSize: '28px' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#0f172a' }}>
                Create Account
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
                Join our mathematics community
            </Text>
          </div>

          {/* CARD SECTION */}
          <Card 
            bordered={true}
            style={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Shadow kiểu Tailwind
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {/* Hiển thị lỗi nếu có */}
            {errors.length > 0 && (
                <Alert
                    message="Error"
                    description={
                        <ul style={{ paddingLeft: 20, margin: 0 }}>
                            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                        </ul>
                    }
                    type="error"
                    showIcon
                    style={{ marginBottom: 24, borderRadius: 8 }}
                />
            )}

            <Form name="register" onFinish={onFinish} layout="vertical" size="large">
              
              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Full Name</span>}
                name="fullName" 
                rules={[{ required: true, message: 'Please enter your full name' }]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Username</span>}
                name="username" 
                rules={[{ required: true, message: 'Please choose a username' }]}
              >
                <Input placeholder="Choose a username" />
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Email</span>}
                name="email" 
                rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Invalid email format' }
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Password</span>}
                name="password" 
                rules={[
                    { required: true, message: 'Please create a password' },
                    { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password placeholder="Create a password" />
              </Form.Item>

              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Confirm Password</span>}
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm your password" />
              </Form.Item>

              <Form.Item style={{ marginTop: 10, marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Form.Item>
              
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Already have an account? </Text>
                <Link to="/login" style={{ color: primaryColor, fontWeight: 600, fontSize: '14px' }}>
                  Sign in
                </Link>
              </div>
            </Form>
          </Card>
          
          {/* FOOTER */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Text type="secondary" style={{ fontSize: '12px', color: '#64748b' }}>
                © 2025 Math Forum AI Project. All rights reserved.
            </Text>
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Register;