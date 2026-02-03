# การติดตั้ง Smooth Page Transitions

## 1. ติดตั้ง Dependencies

```bash
npm install framer-motion
```

## 2. เพิ่มไฟล์ที่สร้าง

### วางไฟล์ตามตำแหน่งนี้:
```
app/
├── components/
│   ├── PageTransition.tsx      (from components_page_transition.tsx)
│   ├── SmoothLink.tsx          (from components_smooth_link.tsx)
│   └── LoadingBar.tsx          (from components_loading_bar.tsx)
└── styles/
    └── transitions.css         (from styles_transitions.css)
```

## 3. เพิ่ม CSS ใน app/globals.css

เพิ่มบรรทัดนี้ใน `app/globals.css`:
```css
@import './styles/transitions.css';
```

## 4. อัปเดต app/layout.tsx

```tsx
import { LoadingBar } from './components/LoadingBar';
import './styles/transitions.css';

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body>
        <LoadingBar />
        {children}
      </body>
    </html>
  );
}
```

## 5. Wrap หน้าด้วย PageTransition

### ตัวอย่าง: app/page.tsx
```tsx
import PageTransition from './components/PageTransition';

export default function Page() {
  return (
    <PageTransition>
      <div className="fade-in">
        {/* Content here */}
      </div>
    </PageTransition>
  );
}
```

### ตัวอย่าง: app/login/page.tsx
```tsx
import PageTransition from '../components/PageTransition';

export default function LoginPage() {
  return (
    <PageTransition>
      <div className="fade-in">
        {/* Login form */}
      </div>
    </PageTransition>
  );
}
```

## 6. ใช้ SmoothLink แทน router.push

### ก่อน:
```tsx
<button onClick={() => router.push('/room')}>
  เข้าห้อง
</button>
```

### หลัง:
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// วิธีที่ 1: ใช้ inline delay
<button onClick={async () => {
  await new Promise(resolve => setTimeout(resolve, 150));
  router.push('/room');
}}>
  เข้าห้อง
</button>

// วิธีที่ 2: ใช้ helper function
const navigateSmooth = async (path: string) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  router.push(path);
};

<button onClick={() => navigateSmooth('/room')}>
  เข้าห้อง
</button>
```

## 7. เพิ่ม Stagger Animation สำหรับ Lists

```tsx
<div className="stagger-children">
  {items.map((item) => (
    <div key={item.id} className="card-hover">
      {/* Card content */}
    </div>
  ))}
</div>
```

## 8. เพิ่ม Hover Effects

### ก่อน:
```tsx
<button className="px-4 py-2 bg-blue-600">
  คลิก
</button>
```

### หลัง:
```tsx
<button className="px-4 py-2 bg-blue-600 hover:scale-105 transition-transform duration-200">
  คลิก
</button>
```

## 9. Modal Animations

```tsx
{showModal && (
  <div className="modal-backdrop">
    <div className="modal-content">
      {/* Modal content */}
    </div>
  </div>
)}
```

## 10. Loading State

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  // Do something
  await new Promise(resolve => setTimeout(resolve, 150));
  router.push('/success');
};

return (
  <button disabled={isLoading} className={isLoading ? 'opacity-50' : ''}>
    {isLoading ? 'กำลังโหลด...' : 'ส่ง'}
  </button>
);
```

## คลาสที่ใช้ได้:

- `.fade-in` - Fade in animation
- `.card-hover` - Card hover effect with lift
- `.stagger-children` - Stagger animation for children
- `.modal-backdrop` - Modal backdrop fade
- `.modal-content` - Modal content scale + fade
- `.skeleton` - Loading skeleton

## Framer Motion Utilities:

```tsx
import { motion } from 'framer-motion';

// Button with hover/tap
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  คลิก
</motion.button>

// Fade in with slide
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Tips:

1. ใช้ `transition-all duration-200 ease-in-out` สำหรับ hover effects
2. ใช้ delay 150ms ก่อน navigate เพื่อให้ animation เสร็จ
3. ใช้ `will-change: transform` สำหรับ elements ที่ animate บ่อย
4. ใช้ `transform` และ `opacity` แทน `top`, `left` เพื่อ performance
5. เพิ่ม `loading` state ระหว่างการ navigate

## Performance:

- ใช้ `transform` แทน `position` changes
- ใช้ `opacity` แทน `visibility`
- ใช้ `will-change` อย่างระมัดระวัง
- หลีกเลี่ยง `box-shadow` animations (ใช้ `filter: drop-shadow` แทน)