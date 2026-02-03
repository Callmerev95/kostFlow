Database Design - Kost-Pulse
Project ini menggunakan PostgreSQL (Supabase) dengan Prisma ORM.

Entities:

1. User (Owner): Menyimpan kredensial pemilik kos.

2. Room: Data kamar beserta harga dan status ketersediaan.

3. Tenant: Data penghuni yang terhubung langsung ke kamar (1-to-1).

4. Transaction: Record tagihan bulanan, status pembayaran, dan bukti transfer.

Flow Data:

- Owner mengelola Room dan Tenant.

- Sistem men-generate Transaction untuk tiap Tenant.

- Tenant memberikan bukti transfer (Payment Proof) yang disimpan di Supabase Storage.
