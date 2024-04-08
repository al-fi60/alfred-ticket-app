import React from "react";
import prisma from "@/prisma/db";
import { Status } from "@prisma/client";
import DashRecentTickets from "@/components/DashRecentTickets";
import DashChart from "@/components/DashChart";

const Dashboard = async () => {
  const tickets = await prisma.ticket.findMany({
    where: {
      NOT: [{ status: "CLOSED" }],
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: 0,
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  const groupTicket = await prisma.ticket.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
  });

  // Define the type for the 'item' parameter
  type GroupedTicket = {
    status: Status;
    _count: {
      id: number;
    };
  };

  const data = groupTicket.map((item: GroupedTicket) => {
    return {
      name: item.status,
      total: item._count.id,
    };
  });

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 px-2">
        <div>
          <DashRecentTickets tickets={tickets} />
        </div>
        <div>
          <DashChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
