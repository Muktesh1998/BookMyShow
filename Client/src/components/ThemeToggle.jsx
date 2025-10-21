import { Button, Tooltip } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 1000 }}>
      <Tooltip title={isDark ? "Switch to light" : "Switch to dark"}>
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<BulbOutlined />}
          aria-label="Toggle theme"
          onClick={toggle}
        />
      </Tooltip>
    </div>
  );
}
