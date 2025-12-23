import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Checkbox, ConfigProvider } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types/auth.types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Màu chủ đạo (Dark Blue) giống trang Register
  const primaryColor = '#1e3a8a';

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const res = await authService.login(values);
      if (res.success) {
        message.success('Welcome back!');
        navigate('/'); 
      } else {
        message.error(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (error: any) {
        message.error('Unable to connect to the server.');
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
                controlHeightLG: 45, // Chiều cao input lớn
                activeBorderColor: primaryColor,
                hoverBorderColor: primaryColor,
            },
            Button: {
                controlHeightLG: 45,
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
          backgroundColor: '#f8fafc', // Màu nền xám nhạt
          padding: '20px'
        }}
      >
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          {/* HEADER SECTION: Icon & Title */}
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 64, height: 64, 
                backgroundColor: 'rgba(30, 58, 138, 0.1)', // Nền icon nhạt
                borderRadius: '16px', 
                marginBottom: 16,
                color: primaryColor
            }}>
                {/* Dùng Icon Calculator cho phù hợp Diễn đàn toán học */}
                <CalculatorOutlined style={{ fontSize: '28px' }} />
            </div>
            <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#0f172a' }}>
                Welcome Back
            </Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
                Sign in to continue to Math Forum
            </Text>
          </div>

          {/* CARD SECTION */}
          <Card 
            bordered={true}
            style={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Form 
              name="login" 
              onFinish={onFinish} 
              layout="vertical" 
              size="large"
              initialValues={{ remember: true }}
            >
              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Username</span>}
                name="username" 
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>

              <Form.Item 
                label={<span style={{ fontWeight: 500 }}>Password</span>}
                name="password" 
                rules={[{ required: true, message: 'Please enter your password' }]}
                style={{ marginBottom: 12 }}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>

              {/* Remember me & Forgot Password Row */}
              <Form.Item style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox style={{ color: '#64748b' }}>Remember me</Checkbox>
                  </Form.Item>
                  <a href="#" style={{ color: primaryColor, fontWeight: 500, fontSize: '14px' }}>
                    Forgot password?
                  </a>
                </div>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Form.Item>
              
              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Don't have an account? </Text>
                <Link to="/register" style={{ color: primaryColor, fontWeight: 600, fontSize: '14px' }}>
                  Sign up
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

export default Login;