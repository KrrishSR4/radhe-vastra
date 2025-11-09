import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import AdminPanel from "./AdminPanel";
import { toast } from "sonner";

const Footer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleHeartClick = () => {
    setIsDialogOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "radheradhe") {
      setIsDialogOpen(false);
      setIsAdminOpen(true);
      setPassword("");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <>
      <footer className="py-8 px-6 bg-primary text-primary-foreground shadow-2xl">
        <div className="container mx-auto text-center">
          <p className="text-sm font-medium">
            Made with{" "}
            <span onClick={handleHeartClick} className="cursor-pointer hover:scale-110 inline-block transition-transform">
              ❤️
            </span>
            {" "}— AMIT GUPTA
          </p>
        </div>
      </footer>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Admin Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
};

export default Footer;
