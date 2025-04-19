SELECT 
    s.id,
    s.name,
    s.description,
    s.price,
    s.duration,
    s.company_id as "companyId",
    s.is_active as "isActive",
    s.details,
    s.created_at as "createdAt",
    s.updated_at as "updatedAt",
    s.capacity,
    COALESCE(SUM(spv.price), 0) AS "totalPriceVariation"
  FROM 
    services s
  LEFT JOIN 
    service_price_variations spv ON s.id = spv.service_id
  WHERE 
    s.company_id = $1
  GROUP BY 
    s.id, s.name, s.description, s.price, s.duration, s.company_id, s.is_active, s.details, s.capacity, s.created_at, s.updated_at