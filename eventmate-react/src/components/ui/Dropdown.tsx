import { Fragment, type ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  menuWidth?: string; // ancho opcional
}

const Dropdown = ({ trigger, children, menuWidth = 'w-56' }: DropdownProps) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600/75">
          {trigger}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={cn(
            'absolute right-0 mt-2 origin-top-right divide-y divide-pink-300 rounded-md bg-pink-100 shadow-lg ring-1 ring-black/5 focus:outline-none',
            menuWidth
          )}
        >
          <div className="px-1 py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

// Componente hijo para las opciones
interface DropdownItemProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export const DropdownItem = ({ onClick, children, className }: DropdownItemProps) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={cn(
            'group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
            active
              ? 'bg-pink-600 text-white'
              : 'text-black hover:bg-pink-200',
            className
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

export default Dropdown;
