import Dropdown, { DropdownItem } from "../ui/Dropdown"; // Importamos ambos
import Avatar from "./Avatar";

interface DropDownOption {
  value: string;
  label: string;
  action: () => void | Promise<void>;
}

interface AvatarDropdownMenuProps {
  options: DropDownOption[];
  name: string;
}

const AvatarDropdownMenu = ({ options, name }: AvatarDropdownMenuProps) => {
  return (
    <Dropdown 
      trigger={<Avatar avatarPlaceholder={name} />}
      menuWidth="w-56" 
    >
      {options.map((option) => (
        <DropdownItem key={option.value} onClick={option.action}>
          {/* Aquí el texto ya no se cortará y estará en una línea */}
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default AvatarDropdownMenu;